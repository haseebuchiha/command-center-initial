import { Home } from '@/views/Home';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: 'LaunchBased - Command Center',
    description: 'AI Agent Teams Made Easy for Solopreneurs.',
  };
}

export const HomeController = async () => {
  return <Home />;
};
