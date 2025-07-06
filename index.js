const express = require("express");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const Queue = require("bull");
const app = express();
const serverAdapter = new ExpressAdapter();

const queue = new Queue("webhookQueue", { redis: { host: "redis" } });

createBullBoard({
  queues: [new BullAdapter(queue)],
  serverAdapter,
});

serverAdapter.setBasePath("/dashboard");
app.use("/dashboard", serverAdapter.getRouter());

app.listen(3000, () => console.log("Dashboard disponível em /dashboard"));
