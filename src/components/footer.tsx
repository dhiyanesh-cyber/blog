// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white py-4 mt-10">
      <div className="container mx-auto text-center">
        <p className='text-sm'>&copy; {new Date().getFullYear()} Blogzpot. All rights reserved.</p>
        <div className="mt-2">
          <a href="/privacy-policy" className="text-gray-400 hover:text-white mx-2 text-sm">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="text-gray-400 hover:text-white mx-2 text-sm">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
