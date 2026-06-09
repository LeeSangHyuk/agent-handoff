export const AgentHandoffPlugin = async () => {
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
