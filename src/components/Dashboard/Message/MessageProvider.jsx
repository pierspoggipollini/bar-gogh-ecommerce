import React, { useState } from 'react'
import MessageContext from './MessageContext';

const MessageProvider = ({ children }) => {

const [isNotificationVisible, setIsNotificationVisible] = useState(false);
const [text, setText] = useState({
  confirm: "",
  error: "",
});

const showSuccessMessage = (message) => {
  setText((prevText) => ({
    ...prevText,
    confirm: message,
  }));
  setIsNotificationVisible(true);
    setTimeout(() => {
      clearMessages();
    }, 300);
};

const showErrorMessage = (message) => {
  setText((prevText) => ({
    ...prevText,
    confirm: "",
    error: message,
  }));
  setIsNotificationVisible(true);

  setTimeout(() => {
    clearMessages()
  }, 300);
};

const clearMessages = () => {
  setTimeout(() => {
    setIsNotificationVisible(false);
    setText((prevText) => ({
      ...prevText,
      confirm: "",
      error: "",
    }));
  }, 1300);
};

  return (
    <MessageContext.Provider value={{
        isNotificationVisible,
        setIsNotificationVisible,
        text,
        showSuccessMessage,
        showErrorMessage,
    }}>
        {children}
    </MessageContext.Provider>
  )
}

export default MessageProvider