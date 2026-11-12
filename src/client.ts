import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
// import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
// import { fileURLToPath } from "node:url";

const client = new Client({
  version: "1.0.0",
  name: "github-issue-client",
});

const url = new URL(process.argv[2] ?? "http://127.0.0.1:3000/mcp");
const transport = new StreamableHTTPClientTransport(url);

// const serverPath = fileURLToPath(new URL("./index.js", import.meta.url));

// const transport = new StdioClientTransport({
//   command: process.execPath,
//   args: [serverPath],
// });

try {
  await client.connect(transport);

  // const { tools } = await client.listTools();
  // console.log("Available tools:", tools.map((tool) => tool.name).join(", "));

  // const result = await client.callTool({
  //   name: "search-issues",
  //   arguments: {
  //     repository: "nodejs/node",
  //     query: "fetch",
  //   },
  // });

  // for (const block of result.content) {
  //   if (block.type === "text") {
  //     console.log(block.text);
  //   }
  // }

  const { resources } = await client.listResources();
  const { prompts } = await client.listPrompts();

  console.log(
    "Resources:",
    resources.map((resource) => resource.name).join(", "),
  );
  console.log("Prompts:", prompts.map((prompt) => prompt.name).join(", "));

  const guide = await client.readResource({ uri: "guide://bug-report" });

  for (const item of guide.contents) {
    if ("text" in item) console.log(item.text);
  }

  const prompt = await client.getPrompt({
    name: "triage-bug",
    arguments: {
      repository: "nodejs/node",
      bugSummary:
        "An aborted fetch request returns an unexpected error message.",
    },
  });

  for (const message of prompt.messages) {
    if (message.content.type === "text") console.log(message.content.text);
  }
} finally {
  await client.close();
}
