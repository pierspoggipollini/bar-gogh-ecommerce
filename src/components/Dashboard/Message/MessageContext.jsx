import React, { createContext, useContext } from "react";

// Create a new context for form functions
const MessageContext = createContext();

// Custom hook to use the form context
export const useMessageContext = () => useContext(MessageContext);

export default MessageContext;
