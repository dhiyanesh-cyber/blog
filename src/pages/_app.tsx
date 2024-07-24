// pages/_app.tsx
import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Inter } from "next/font/google";
import "../app/globals.css";
import Header from '@/components/header';
import Footer from '@/components/footer';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY; // Your Clerk frontend API

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  const router = useRouter();

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      {/* Redirect to sign-in if not authenticated */}
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ClerkProvider>
  );
}

export default MyApp;
