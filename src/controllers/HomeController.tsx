import { Home } from '@/views/Home';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Prototyper Home',
    description:
      'Welcome to AI Prototyper - Build and test your AI-powered ideas quickly.',
  };
}

export const HomeController = async () => {
  return <Home />;
};
