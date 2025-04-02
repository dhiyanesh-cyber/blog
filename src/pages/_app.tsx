// pages/_app.tsx
import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import "./_app.css"
import Header from '@/components/header/header';
import Footer from '@/components/footer';
import { SearchProvider } from '@/context/SearchContext';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  const router = useRouter();

  return (
    <div className={`flex flex-col min-h-svh`}>
      <ClerkProvider >
        <SearchProvider>
          <Header />
          <div className='flex-grow nunito'>
            <Component {...pageProps}/>
          </div>
          <Footer />
        </SearchProvider>
      </ClerkProvider>
    </div>
  );
}

export default MyApp;
