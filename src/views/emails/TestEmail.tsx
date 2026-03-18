import React from 'react';
import { Text } from '@react-email/components';
import Layout from './layout/Layout';

export const TestEmail = () => {
  return (
    <Layout preview={`Test Email`}>
      <Text className="text-base text-gray-700 mb-6">Hello Test User,</Text>

      <Text className="text-gray-700 text-base leading-6">
        This email confirms that your test email has been sent successfully.
      </Text>
    </Layout>
  );
};
