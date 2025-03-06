import React from "react";
import { createContext } from "react";

interface Context {
  userProfile: UserProfile;
  accessToken: string;
  setAccessToken: (token: string) => void;
  isLoggedIn: boolean;
}

export const ProfileContext = createContext<Context>({
  userProfile: {
    id: "",
    email: "",
    name: "",
    picture: "",
  },
  accessToken: "",
  setAccessToken: () => {},
  isLoggedIn: false,
});

interface Props {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<Props> = ({ children }) => {
  const [accessToken, setAccessToken] = React.useState<string>(undefined);
  const [userProfile, setUserProfile] = React.useState<UserProfile>({
    id: "",
    email: "",
    name: "",
    picture: "",
  });

  React.useEffect(() => {
    const getUserProfile = async (accessToken) => {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      return response.json();
    };

    if (!accessToken) {
      return;
    }

    getUserProfile(accessToken).then(({ name, email }) => {
      setUserProfile({
        id: "",
        name,
        email,
        picture: "",
      });
    });
  }, [accessToken]);

  const isLoggedIn = React.useMemo(() => {
    return !!accessToken;
  }, [accessToken]);

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        accessToken,
        setAccessToken,
        isLoggedIn,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = React.useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "To use useProfile you must wrap your component around ProfileProvider"
    );
  }

  return context;
};
