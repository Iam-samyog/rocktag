import { cookies } from 'next/headers';
import { SignOutButton } from './sign-out-button';

export async function ConditionalSignOutButton() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('firebase-auth-token')?.value;
  
  // Only show sign-out button if user is authenticated
  if (!authToken) {
    return null;
  }
  
  return <SignOutButton />;
}
