import { UserAuth } from '@/services/UserAuth';
import { Website } from '@/views/website/Website';

export const WebsiteController = async () => {
  const user = await UserAuth.getUser();
  return <Website userName={user?.name || 'your-business'} />;
};
