import React from "react";
import { Router } from "@/core/router/Router";
import "./style.css";
import { ProfileProvider } from "./core/profile/profile.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockApiProvider } from "@/test/MockApiProvider";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <>
      {import.meta.env.DEV ? (
        <MockApiProvider>
          <QueryClientProvider client={queryClient}>
            <ProfileProvider>
              <Router />
            </ProfileProvider>
          </QueryClientProvider>
        </MockApiProvider>
      ) : (
        <QueryClientProvider client={queryClient}>
          <ProfileProvider>
            <Router />
          </ProfileProvider>
        </QueryClientProvider>
      )}
    </>
  );
};
