# Chrome DevTools MCP Configuration

This directory includes a Chrome DevTools Model Context Protocol (MCP) server configuration that enables AI agents to interact with and test the BookCatalog web application during modernization tasks.

## Overview

The Chrome DevTools MCP server allows agents to:
- Automate browser testing and verification
- Capture screenshots and performance metrics
- Interact with web elements for UI testing
- Analyze network activity and console output
- Verify application behavior across different states

## Configuration File

**File:** `chrome-devtools-mcp.json`

This configuration sets up Chrome DevTools with the following defaults:

| Option | Value | Purpose |
|--------|-------|---------|
| `--headless` | Enabled | Runs Chrome without a visible UI (suitable for automated testing) |
| `--channel` | `stable` | Uses the stable Chrome channel |
| `--viewport` | `1280x720` | Sets initial viewport size for consistent screenshots |

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Chrome or Chromium browser available on your system

### Enable the MCP Server

1. **For GitHub Copilot App or VS Code:**
   - Open your MCP configuration file (`claude_desktop_config.json` or equivalent)
   - Add or update the Chrome DevTools server entry using the configuration from `chrome-devtools-mcp.json`

2. **For Visual Studio (Windows):**
   - The GitHub Copilot modernization agent will automatically detect this configuration
   - Ensure Chrome is installed and accessible

3. **Verify the Connection:**
   ```bash
   npx chrome-devtools-mcp@latest --headless
   ```
   This should start the MCP server without errors.

## Configuration Options

### Common Scenarios

#### Remote Debugging (Connect to Existing Browser)
If you want to connect to a browser session already signed in or with existing cookies:

1. Start Chrome with remote debugging:
   ```bash
   # Windows
   start chrome --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile-stable
   ```

2. Update `chrome-devtools-mcp.json`:
   ```json
   {
     "mcpServers": {
       "chrome-devtools": {
         "command": "npx",
         "args": [
           "-y",
           "chrome-devtools-mcp@latest",
           "--browser-url=http://127.0.0.1:9222"
         ]
       }
     }
   }
   ```

#### Using Canary Channel
For testing with the latest Chrome features:

Update the `--channel` argument:
```json
"args": ["-y", "chrome-devtools-mcp@latest", "--headless", "--channel=canary"]
```

#### Custom User Data Directory
To use a custom Chrome profile:

```json
"args": [
  "-y",
  "chrome-devtools-mcp@latest",
  "--headless",
  "--user-data-dir=/path/to/profile"
]
```

## Testing the Configuration

Once configured, you can test the MCP server in your agent:

1. **Start the BookCatalog app:**
   ```bash
   cd shared-legacy-app
   # Follow the app startup instructions in the main README
   ```

2. **In your agent interface (VS Code, GitHub Copilot app, or CLI):**
   - Ask the agent to navigate to the app's URL (e.g., `http://localhost:port`)
   - Request screenshots, element interactions, or network analysis
   - Verify that Chrome DevTools responds with the expected data

## Security Considerations

- **Headless Mode:** The default configuration runs Chrome headless. For security-sensitive testing, consider running in an isolated environment.
- **Network Access:** By default, all network requests are allowed. Use `--blocked-url-pattern` to restrict access if needed.
- **Certificate Validation:** The configuration accepts valid certificates. Use `--accept-insecure-certs` cautiously in development only.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP server fails to start | Ensure Node.js is installed and Chrome is available in your PATH. Run `npx chrome-devtools-mcp@latest --headless` directly to see error details. |
| Agent can't connect to the browser | Verify the app is running on the expected port and accessible at `http://localhost:port`. Check firewall settings. |
| Screenshots are blank | Ensure the application has fully loaded before requesting screenshots. The agent may need a small delay. |
| Connection timeout | The Chrome instance may be busy. Try restarting the MCP server or increasing timeout settings. |

## References

- [Chrome DevTools MCP Documentation](https://developer.chrome.com/docs/devtools/agents/get-started/configuration)
- [Chrome DevTools MCP GitHub Repository](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io)

## Next Steps

- Use this configuration with the GitHub Copilot modernization agent for testing during .NET upgrades
- Combine with the BookCatalog upgrade plan to automate UI regression testing
- Extend the configuration for performance monitoring and accessibility checks
