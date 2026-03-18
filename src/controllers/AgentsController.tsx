import { AgentOffice } from '@/views/agents/AgentOffice';

export const AgentsController = async () => {
  // Static agent data for now, will fetch from DB in future
  return <AgentOffice />;
};
