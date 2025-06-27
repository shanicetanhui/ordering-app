# Customer Ordering App

This is a **Customer Ordering App** for a two-person project demonstrating inter-application communication using **RabbitMQ**.

Built with **Svelte + TypeScript** for the frontend and **Node.js + Express** for the backend, this system allows users to place simple food and drink orders which are sent to another system (Person B) via RabbitMQ.



## Overview

This app is part of a two-part system:

- 👤 **Person A (this repo)** – Customer-facing web app for placing orders.
- 👤 **Person B** – Kitchen Dashboard or CLI app that receives the orders.

The two apps communicate via RabbitMQ using a shared `orders` message queue.



## Features

- Web-based ordering interface
- Order form with item selection and quantity input
- Backend POST endpoint to receive orders
- Sends order data to RabbitMQ in JSON format



## Tech Stack

- **Frontend:** Svelte + TypeScript
- **Backend:** Node.js + Express
- **Messaging:** RabbitMQ (`amqplib`)
- **Dev Tools:** Docker (for RabbitMQ)
