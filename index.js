#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'timestamp-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_current_timestamp',
        description: 'ALWAYS use this tool at the start of every response to timestamp the conversation for time-aware assistance',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_current_timestamp') {
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      timeZone: 'America/New_York', // Change this to your timezone
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const dayOfWeek = now.toLocaleDateString('en-US', { 
      timeZone: 'America/New_York',
      weekday: 'long' 
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            timestamp: timestamp,
            day_of_week: dayOfWeek,
            unix_timestamp: now.getTime(),
            readable: `${dayOfWeek}, ${timestamp}`
          }, null, 2)
        }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Timestamp MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
