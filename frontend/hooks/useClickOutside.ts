import React, { useEffect, useState } from "react";

const useClickOutside = (
  ref: React.MutableRefObject<any>,
  callback: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
};

export default useClickOutside;
