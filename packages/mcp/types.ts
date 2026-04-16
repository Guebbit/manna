/**
 * MCP bridge types — configuration and discovered tool metadata.
 *
 * @module mcp/types
 */

/**
 * Configuration for a single MCP server.
 *
 * Loaded from the MCP config JSON file at startup.
 */
export interface IMCPServerConfig {
    /** Human-readable server name used as the namespace prefix for tool names. */
    name: string;

    /** Transport type used to connect to this server. */
    transport: 'stdio' | 'sse';

    /** Command to spawn when `transport === "stdio"` (for example: `npx`). */
    command?: string;

    /** CLI arguments passed to `command` for stdio servers. */
    args?: string[];

    /**
     * Environment variables for stdio child processes.
     *
     * Supports `${VAR}` interpolation from `process.env`.
     */
    env?: Record<string, string>;

    /** URL used when `transport === "sse"`. */
    url?: string;

    /**
     * Per-server connection timeout in milliseconds.
     *
     * If omitted, loader falls back to `MCP_CONNECT_TIMEOUT_MS` or `5000`.
     */
    timeoutMs?: number;

    /**
     * Whether discovered tools from this server are write tools.
     *
     * Defaults to `false`.
     */
    writeTools?: boolean;
}

/**
 * Full MCP configuration file shape.
 */
export interface IMCPConfig {
    /** List of MCP servers to connect at startup. */
    servers: IMCPServerConfig[];
}

/**
 * Metadata about a discovered MCP tool before it is wrapped as `ITool`.
 */
export interface IMCPToolMeta {
    /** MCP server name that provided this tool. */
    serverName: string;

    /** Original MCP tool name reported by the server. */
    originalName: string;

    /** Namespaced Manna tool name (example: `mcp_github__create_issue`). */
    mannaName: string;

    /** Human-readable MCP tool description. */
    description: string;

    /** Whether this tool is considered write-capable in Manna. */
    isWrite: boolean;
}
