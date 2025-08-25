import React from 'react';
import UnifiedMenuSystem from './UnifiedMenuSystem';

const CRMMenu = ({ isOpen, onClose, isMobile }) => {
  return (
    <UnifiedMenuSystem 
      isOpen={isOpen} 
      onClose={onClose} 
      isMobile={isMobile} 
      menuType="crm" 
    />
  );
};

export default CRMMenu;
