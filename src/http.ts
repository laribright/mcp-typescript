import { createServer } from "node:http";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { createMcpServer } from "./mcp.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ? "0.0.0.0" : "127.0.0.1";

const httpServer = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }

  if (req.url !== "/mcp") {
    res.writeHead(404).end();
    return;
  }

  if (req.headers.origin !== undefined) {
    res.writeHead(403).end();
    return;
  }

  const server = createMcpServer();
  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.once("close", () => {
    void server.close().catch(console.error);
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});

httpServer.listen(port, host, () => {
  console.error(`Server is running on http://${host}:${port}/mcp`);
});
