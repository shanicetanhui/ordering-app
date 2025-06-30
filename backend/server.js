const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

interface OrderStatus {
	orderId: number;
	status: string;
}

const app = express();
const PORT: number = 3000;
const completedOrders: OrderStatus[] = [];

const RABBITMQ_URL = 'amqp://localhost';

app.use(cors());
app.use(express.json());

let channel;

// connect to RabbitMQ
async function connectRabbit() {
	try {
		const connection = await amqp.connect(RABBITMQ_URL);
		connection.on('error', (err) => {
			console.error('❌ RabbitMQ connection error:', err);
		});
		
		channel = await connection.createChannel();
		channel.on('error', (err) => {
			console.error('❌ RabbitMQ channel error:', err);
		});
		
		await channel.assertQueue('orders', { durable: false });
		console.log('✅ Connected to RabbitMQ');
	} catch (err) {
		console.error('❌ Failed to connect to RabbitMQ:', err);
	}
}

app.post('/api/order', async (req, res) => {
	try {
		const { name, quantity } = req.body;
		console.log('Received order:', req.body);

		if (!name || !quantity) {
			return res.status(400).json({ message: 'Missing name or quantity' });
		}

		if (!channel) {
			console.error('❌ RabbitMQ channel not ready');
			return res.status(500).json({ message: 'Server not connected to message queue' });
		}

		// Send message to RabbitMQ
		const order = JSON.stringify({ name, quantity });
		await channel.sendToQueue('orders', Buffer.from(order));
		console.log('✅ Sent to RabbitMQ:', order);

		res.status(200).json({ message: 'Order received' });

	} catch (err) {
		console.error('❌ Error in /api/order:', err);
		res.status(500).json({ message: 'Server error' });
	}
});


app.listen(PORT, () => {
	console.log(`🚀 Backend listening on http://localhost:${PORT}`);
	connectRabbit();
});

// Receive messages from RabbitMQ
async function receiveMessages() {
	try {
		const connection = await amqp.connect(RABBITMQ_URL);
		connection.on('error', (err) => {
			console.error('❌ RabbitMQ connection error in receiveMessages:', err);
		});
		
		const channel = await connection.createChannel();
		channel.on('error', (err) => {
			console.error('❌ RabbitMQ channel error in receiveMessages:', err);
		});

		await channel.assertQueue('orders', { durable: false });
		await channel.assertQueue('orderStatus', { durable: false });

		console.log('✅ Connected to RabbitMQ for receiving messages');

		channel.consume('orderStatus', (msg) => {
			if (msg !== null) {
				const orderStatus = JSON.parse(msg.content.toString());
				console.log('Received order status:', orderStatus);
				channel.ack(msg);

				completedOrders.push(orderStatus);
			}
		});
	} catch (err) {
		console.error('❌ Failed to connect to RabbitMQ for receiving messages:', err);
		process.exit(1);
	}
}

receiveMessages();

app.get('/api/status', (req, res) => {
	res.json(completedOrders);
});