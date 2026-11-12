import { createMcpServer } from "./mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";

const server = createMcpServer();

server.connect(new StdioServerTransport());
console.error("Server is running...");
