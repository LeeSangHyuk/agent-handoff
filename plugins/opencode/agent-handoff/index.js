export const AgentHandoffPlugin = async ({ client } = {}) => {
  await client?.app?.log?.({
    body: {
      service: "agent-handoff",
      level: "info",
      message: "Agent Handoff OpenCode plugin initialized",
    },
  });

  return {
    event: async ({ event }) => {
      if (event?.type !== "session.compacted") {
        return;
      }

      // Initial scaffold: the durable behavior is expressed through AGENTS.md.
      // A later version can inject handoff-specific compaction context here.
    },
  };
};

export default AgentHandoffPlugin;
