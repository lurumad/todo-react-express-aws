import React from "react";

interface Props {
  children: React.ReactNode;
}

export const CenteredLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {children}
    </div>
  );
};
