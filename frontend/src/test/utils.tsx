import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClientDefaultOptions = {
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
};

export const TestProviders = ({ children }) => {
  const queryClient = new QueryClient(queryClientDefaultOptions);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
