import React from "react";

interface IProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<IProps> = ({ className, children, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      type={type ? type : "button"}
      className={`
     rounded-xl py-1 px-2 text-md w-full h-10 flex items-center justify-center ${className}
    `}
    >
      {children}
    </button>
  );
};

export default Button;
