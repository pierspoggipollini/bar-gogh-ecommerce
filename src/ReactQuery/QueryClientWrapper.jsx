import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

// Create a new instance of QueryClient
export const queryClient = new QueryClient();

// QueryClientWrapper component to wrap children with QueryClientProvider
export const QueryClientWrapper = ({ children }) => {
  return (
    // Wrap the children components with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
