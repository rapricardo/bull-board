const express = require("express");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const basicAuth = require('express-basic-auth'); // <-- Adicione esta linha

const Queue = require("bull");
const app = express();
const serverAdapter = new ExpressAdapter();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD; 
const BULLBOARD_USERNAME = process.env.BULLBOARD_USERNAME; // <-- Nova variável
const BULLBOARD_PASSWORD = process.env.BULLBOARD_PASSWORD; // <-- Nova variável

const redisConfig = {
  host: "redis",
  port: 6379,
  password: REDIS_PASSWORD,
};

const queue = new Queue("webhookQueue", { redis: redisConfig });

createBullBoard({
  queues: [new BullAdapter(queue)],
  serverAdapter,
});

serverAdapter.setBasePath("/dashboard");

// Aplica a autenticação básica APENAS ao caminho /dashboard
app.use(
  "/dashboard", 
  basicAuth({
    users: { [BULLBOARD_USERNAME]: BULLBOARD_PASSWORD }, // Lê do ambiente
    challenge: true, // Garante que o navegador peça as credenciais
    unauthorizedResponse: (req) => { // Mensagem para autenticação falha
      return req.auth ? 'Credenciais inválidas.' : 'Autenticação necessária.';
    },
  }),
  serverAdapter.getRouter() // O router do Bull Board é o último a ser chamado
);

app.listen(3000, () => console.log("Dashboard disponível em /dashboard"));