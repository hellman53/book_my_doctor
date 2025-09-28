import { SignUp } from '@clerk/nextjs' 
import React from 'react' 

function SignUpPage() {
  return (
    <SignUp 
      afterSignUpUrl="/"
      afterSignInUrl="/"
    />
  )
}

export default SignUpPage