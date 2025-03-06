import { LoginPage } from "@/pages/Login";
import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useProfile } from "@/core";
import { ListPage } from "@/pages/List";

export const Router = () => {
  const AuthenticatedListPage = withAuthentication(ListPage);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/list" element={<AuthenticatedListPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const withAuthentication = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function AuthenticatedComponent(props: P) {
    const navigate = useNavigate();
    const { isLoggedIn } = useProfile();

    React.useEffect(() => {
      if (!isLoggedIn) {
        navigate("/");
      }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
