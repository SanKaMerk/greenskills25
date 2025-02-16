import jsonServer from "json-server";

const addDelay = (delay = 0) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.listen(3004, () => {
  console.log(`JSON Server is running: http://localhost:3004`);
});
