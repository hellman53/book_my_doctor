import { SignUp } from '@clerk/nextjs';
import React from 'react';

function SignUpPage() {
  return (
    <SignUp
      afterSignUpUrl="/onboarding"   // 👈 Redirect to onboarding page
      afterSignInUrl="/"             // Optional: Redirect after sign-in
    />
  );
}

export default SignUpPage;
