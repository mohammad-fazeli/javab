import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { setDarkMode } from "../store/theme/slice";
import Heder from "./Heder";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  useEffect(() => {
    if (theme.Mode === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        dispatch(setDarkMode(true));
      } else {
        dispatch(setDarkMode(false));
      }
    }
  }, [dispatch, theme.Mode]);
  return (
    <div dir="rtl" className={`${theme.darkMode && "dark"}`}>
      <div className="w-full min-h-screen bg-[#F6F9FC] dark:bg-[#2B373D] text-slate-700 dark:text-[#D9E5D6] pt-14">
        <div className="w-full md:max-w-screen-md md:mx-auto">
          <Heder />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
