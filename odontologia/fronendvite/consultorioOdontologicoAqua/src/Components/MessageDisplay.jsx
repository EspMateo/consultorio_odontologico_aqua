import React, { useEffect, useState } from 'react';
import './styles/MessageDisplay.css';

const MessageDisplay = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, 3000); // El mensaje desaparece después de 3 segundos

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, onDismiss]);

  if (!isVisible) return null;

  const messageClass = `message-display ${type || 'info'}`;

  return (
    <div className={messageClass}>
      <span>{message}</span>
      <button onClick={() => setIsVisible(false)} className="dismiss-button">x</button>
    </div>
  );
};

export default MessageDisplay; 