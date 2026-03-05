const amqp = require('amqplib');

const EXCHANGE_NAME = 'order.placed';
const EXCHANGE_TYPE = 'topic';

let connection;
let channel;

const buildAmqpUrl = () => {
  if (process.env.RABBITMQ_URL) {
    return process.env.RABBITMQ_URL;
  }

  const host = process.env.RABBITMQ_HOST || 'rabbitmq';
  const port = process.env.RABBITMQ_PORT || '5672';
  const user = process.env.RABBITMQ_USER || 'shopease';
  const password = process.env.RABBITMQ_PASSWORD || 'shopease123';

  return `amqp://${user}:${password}@${host}:${port}`;
};

const getChannel = async () => {
  if (channel) {
    return channel;
  }

  const url = buildAmqpUrl();
  connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });

  return channel;
};

const publishOrderPlacedEvent = async (event) => {
  const ch = await getChannel();
  const payload = Buffer.from(JSON.stringify(event));
  ch.publish(EXCHANGE_NAME, 'order.placed', payload, {
    contentType: 'application/json',
    persistent: true,
  });
};

const closeRabbit = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
  } finally {
    channel = undefined;
    connection = undefined;
  }
};

module.exports = {
  publishOrderPlacedEvent,
  closeRabbit,
};
