import React, { useEffect, useState } from "react";

const useClickOutside = (
  ref: React.MutableRefObject<any>,
  callback: () => void
) => {
  const [click, setClick] = useState(false);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setClick(true);
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, click, ref]);
};

export default useClickOutside;
