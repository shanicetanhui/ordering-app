const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
const PORT = 3000;
const RABBITMQ_URL = 'amqp://localhost';

app.use(cors());
app.use(express.json());

let channel;

// connect to RabbitMQ
async function connectRabbit() {
	try {
		const connection = await amqp.connect(RABBITMQ_URL);
		channel = await connection.createChannel();
		await channel.assertQueue('orders');
		console.log('✅ Connected to RabbitMQ');
	} catch (err) {
		console.error('❌ Failed to connect to RabbitMQ:', err);
	}
}

app.post('/api/order', async (req, res) => {
	try {
		const { item, qty } = req.body;
		console.log('Received body:', req.body);

		if (!item || !qty) {
			return res.status(400).json({ message: 'Missing item or qty' });
		}

		if (!channel) {
			console.error('❌ RabbitMQ channel not ready');
			return res.status(500).json({ message: 'Server not connected to message queue' });
		}

		// Send message to RabbitMQ
		const order = JSON.stringify({ item, qty });
		//await channel.sendToQueue('orders', Buffer.from(order));
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
