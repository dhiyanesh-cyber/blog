import React, { ReactNode } from 'react';

interface ModalProps {
  show: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative bg-black bg-opacity-0 p-5 w-full max-w-lg flex justify-center items-center">
        
        <div className="text-white mt-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
