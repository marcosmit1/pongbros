'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function TopNav() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const publicPaths = ['/', '/login', '/register'];

  if (!user || publicPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <button
        onClick={signOut}
        className="secondary-button shadow-lg hover:shadow-xl"
      >
        Sign Out
      </button>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
} 