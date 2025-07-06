FROM node:20-alpine
WORKDIR /app

# 1. Copia APENAS os arquivos de definição de dependências
COPY package*.json ./

# 2. Instala as dependências - isso cria node_modules limpo e compatível com Alpine
#    Use --production para instalar apenas as dependências de produção, reduzindo o tamanho da imagem
RUN npm install --production 

# 3. Copia o restante do código da aplicação
#    Isso copiará index.js e quaisquer outros arquivos, mas NÃO irá sobrescrever node_modules
COPY . .

# 4. Define a porta que o container irá expor (boa prática, não afeta roteamento do Traefik diretamente)
EXPOSE 3000

# 5. Comando para iniciar a aplicação
CMD ["node", "index.js"]