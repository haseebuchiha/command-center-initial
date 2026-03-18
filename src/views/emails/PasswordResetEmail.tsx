import Layout from './layout/Layout';
import { Text, Button, Hr } from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export default function PasswordResetEmail({
  name,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Layout preview="Reset your password">
      <Text className="text-2xl font-bold mb-4">Reset Your Password</Text>

      <Text className="mb-4">Hello {name},</Text>

      <Text className="mb-4">
        You are receiving this email because we received a password reset
        request for your account.
      </Text>

      <div className="text-center my-6">
        <Button
          href={resetUrl}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-decoration-none inline-block"
        >
          Reset Password
        </Button>
      </div>

      <Text className="mb-4 text-sm text-gray-600">
        This password reset link will expire in 60 minutes.
      </Text>

      <Text className="mb-4 text-sm text-gray-600">
        If you did not request a password reset, no further action is required.
      </Text>

      <Hr className="my-6" />

      <Text className="text-sm text-gray-500">
        If you&apos;re having trouble clicking the &quot;Reset Password&quot;
        button, copy and paste the URL below into your web browser:
      </Text>

      <Text className="text-sm text-gray-500 break-all">{resetUrl}</Text>
    </Layout>
  );
}
