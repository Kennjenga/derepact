import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { prisma } from './prisma';

// Verify the session and return the user ID
export const verifySession = cache(async () => {
  try {
    const cookie = (await cookies()).get('session')?.value;

    if (!cookie) {
      redirect('/login'); // Redirect if no session cookie is found
    }

    const session = await decrypt(cookie);

    if (!session?.userId) {
      redirect('/login'); // Redirect if the session is invalid
    }

    return { isAuth: true, userId: Number(session.userId) };
  } catch (error) {
    console.error('Failed to verify session:', error);
    redirect('/login'); // Redirect on any error during session verification
  }
});

// Fetch the user data based on the session
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { uid: session.userId }, // Use `findUnique` for a single user
      select: {
        uid: true,
        username: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
});