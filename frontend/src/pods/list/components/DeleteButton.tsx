import React from "react";

interface DeleteButtonProps {
  id: string;
  onClick: (id: string) => void;
}

export const DeleteButton = ({ id, onClick }: DeleteButtonProps) => {
  return (
    <button
      onClick={() => onClick(id)}
      className="text-red-500 hover:text-red-600 mouse-pointer cursor-pointer"
      title="Delete"
      data-testid="delete-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2h8a2 2 0 00-2-2m-4 0h4"
        />
      </svg>
    </button>
  );
};
