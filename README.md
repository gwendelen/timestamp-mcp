# Timestamp MCP

A Model Context Protocol server that provides current timestamp information to Claude for time-aware conversations.

## Installation

This MCP server is designed to be used with Claude Desktop. Add it to your Claude configuration:

```json
{
  "mcpServers": {
    "timestamp": {
      "command": "npx",
      "args": ["-y", "github:johnsmith/timestamp-mcp"]
    }
  }
}
