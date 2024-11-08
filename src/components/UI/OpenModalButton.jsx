import React, { useState } from 'react';
import Modal from './Modal';

const OpenModalButton = ({ buttonText, icon: Icon, modalContent: ModalContent, title, className = '', width = 'w-full' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`flex items-center space-x-2 ${width} ${className}`}>
        {Icon && <Icon className="text-white text-2xl" />}
        <span>{buttonText}</span>
      </button>
      
      <Modal isOpen={isOpen} onClose={handleClose} title={title}>
        {/* Pasamos onClose para cerrar el modal después de aplicar filtros */}
        <ModalContent onClose={handleClose} />
      </Modal>
    </>
  );
};

export default OpenModalButton;
