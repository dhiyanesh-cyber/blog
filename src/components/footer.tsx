// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 font-sans text-white py-4 mt-10">
      <div className="container mx-auto text-center">
        <p className='text-sm'>&copy; {new Date().getFullYear()} Blogzpot. All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default Footer;
