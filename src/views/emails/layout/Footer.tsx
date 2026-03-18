import React from 'react';
import { Text, Link, Section } from '@react-email/components';
import { baseUrl } from '@/lib/url';

export const Footer = () => {
  return (
    <Section className="bg-gray-50 px-8 py-6 border-t border-gray-200">
      <Text className="text-gray-700 text-base leading-6 mb-4">
        Best regards,
        <br />
        <strong>The AI Prototyper Team</strong>
      </Text>

      <Text className="text-gray-600 text-sm leading-5 mb-2">
        This email was sent from AI Prototyper. If you have any questions,
        please don&apos;t hesitate to{' '}
        <Link
          href={`${baseUrl('/contact')}`}
          className="text-blue-600 no-underline"
        >
          contact us
        </Link>
        .
      </Text>

      <Text className="text-gray-500 text-xs leading-4">
        © {new Date().getFullYear()} AI Prototyper. All rights reserved.
        <br />
        <Link
          href={`${baseUrl('/unsubscribe')}`}
          className="text-gray-500 no-underline"
        >
          Unsubscribe
        </Link>
        {' • '}
        <Link
          href={`${baseUrl('/privacy')}`}
          className="text-gray-500 no-underline"
        >
          Privacy Policy
        </Link>
      </Text>
    </Section>
  );
};
