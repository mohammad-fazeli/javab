import React, { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";

interface IProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IProps> = ({ children, isOpen, onRequestClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onRequestClose);
  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed z-50 top-0 left-0 w-full h-screen bg-white dark:bg-black dark:bg-opacity-50 bg-opacity-50 flex justify-center items-center`}
    >
      <div ref={ref} className="w-full md:max-w-screen-md">
        {children}
      </div>
    </div>
  );
};

export default Modal;
