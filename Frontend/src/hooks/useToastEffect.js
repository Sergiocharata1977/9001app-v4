import { useEffect } from 'react';

export const useToastEffect = (message, type = 'info', duration = 3000) => {
  useEffect(() => {
    if (message) {
      // Aquí puedes implementar tu lógica de toast
      console.log(`Toast: ${message} (${type})`);
    }
  }, [message, type, duration]);
};
