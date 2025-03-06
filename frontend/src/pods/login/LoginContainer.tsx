import React, { useEffect } from "react";
import { Login } from "./Login";
import { useProfile } from "@/core";
import { useNavigate } from "react-router-dom";

export const LoginContainer = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setAccessToken } = useProfile();
  const handleLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin);
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const authUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${redirectUri}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]*)/;
    const matchAccessToken = window.location.href.match(accessTokenRegex);

    if (matchAccessToken) {
      const accessToken = matchAccessToken[1];
      setAccessToken(accessToken);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/list");
    }
  }, [isLoggedIn]);

  return <Login onLogin={handleLogin} />;
};
