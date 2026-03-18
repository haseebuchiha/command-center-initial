import React from 'react';
import { baseUrl } from '@/lib/url';
import { Link, Section, Text } from '@react-email/components';

export const Header = () => {
  return (
    <Section className="bg-blue-600 px-8 py-6">
      <Link href={baseUrl('/')} className="text-white no-underline">
        <Text className="text-2xl font-bold text-white m-0">AI Prototyper</Text>
      </Link>
    </Section>
  );
};
