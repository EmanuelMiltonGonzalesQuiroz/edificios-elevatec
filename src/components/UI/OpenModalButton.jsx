import React, { useState } from 'react';
import Modal from './Modal';

const OpenModalButton = ({ buttonText, icon: Icon, modalContent: ModalContent, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center space-x-2">
        {Icon && <Icon className="text-white text-2xl" />}
        <span>{buttonText}</span>
      </button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <ModalContent />
      </Modal>
    </>
  );
};

export default OpenModalButton;
