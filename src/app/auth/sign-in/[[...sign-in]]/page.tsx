import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'ConnectAR | Sign In',
  description: 'Enterprise Global Trade & Multi-Modal Landed Cost Platform.'
};

export default async function Page() {
  return <SignInViewPage />;
}
