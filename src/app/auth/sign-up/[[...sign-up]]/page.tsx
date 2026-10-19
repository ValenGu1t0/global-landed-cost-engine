import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'ConnectAR | Sign Up',
  description: 'Enterprise Global Trade & Multi-Modal Landed Cost Platform.'
};

export default async function Page() {
  return <SignUpViewPage />;
}
