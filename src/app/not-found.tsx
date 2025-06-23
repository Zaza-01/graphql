
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Example: redirect after 5 seconds
    const timer = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-semibold font-title text-[#47c1ba] shadow-text">404 <span className='font-light text-white'>|</span> Page Not Found</h1>
    </div>
  );
}
