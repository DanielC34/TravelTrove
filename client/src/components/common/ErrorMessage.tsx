import React from "react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return <p className={`mt-2 text-sm text-red-600 ${className}`}>{message}</p>;
};
