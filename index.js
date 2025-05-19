import { httpServer } from './src/http_server/index.js';
import { startWss } from './src/ws_server/index.js';

const HTTP_PORT = 8181;

startWss();
console.log(`Start static http server on the ${HTTP_PORT} port!`);
console.log(`http://localhost:${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
