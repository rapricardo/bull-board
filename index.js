const express = require('express');
const { createBullBoard } = require('bull-board');
const { BullMQAdapter } = require('bull-board/bullMQAdapter');
const { Queue } = require('bullmq');
const Redis = require('ioredis');

const app = express();
const redisConnection = new Redis({ host: 'redis' });

const queue = new Queue('n8n-jobs', { connection: redisConnection });

const { router } = createBullBoard([
  new BullMQAdapter(queue)
]);

app.use('/dashboard', router);

app.listen(3000, () => {
  console.log('Bull-board disponível em http://localhost:3000/dashboard');
});
