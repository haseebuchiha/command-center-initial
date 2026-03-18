import Link from 'next/link';
import { UserAuth } from '@/services/UserAuth';
import { route } from '@/lib/route';
import { LogoutButton } from './LogoutButton';

export const Header = async () => {
  const user = await UserAuth.getUser();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href={route('home')}
              className="text-xl font-bold text-gray-900"
            >
              App
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Hello, {user.name}</span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href={route('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
