import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import useClickOutside from "../hooks/useClickOutside";
import {
  MdBackspace,
  MdBuild,
  MdChangeCircle,
  MdDarkMode,
  MdLightMode,
  MdWest,
  MdPerson,
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setMode } from "../store/theme/slice";
import type { RootState } from "../store/store";
import { logout } from "../store/user/slice";
import { deleteAccount } from "../store/user/action";
import DeleteAccountForm from "./DeleteAccountForm";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface HeaderDropdownProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ children, title }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  useEffect(() => {
    //setIsOpen(false) if route changes
    setIsOpen(false);
  }, [router.pathname]);
  useClickOutside(dropDownRef, () => {
    setIsOpen(false);
  });
  return (
    <li ref={dropDownRef} className="relative">
      <span
        className="cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {title}
      </span>
      <div
        className={`absolute bg-[#E8F0FF] dark:bg-[#1A535C] px-3 pt-2 pb-1 w-max right-1/2 transition translate-x-1/2 top-9 rounded-lg ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="absolute -top-3 right-1/2 transition translate-x-1/2  border-l-[18px] border-r-[18px] border-b-[18px] border-b-[#E8F0FF] dark:border-b-[#1A535C] border-l-transparent border-r-transparent "></div>
        {children}
      </div>
    </li>
  );
};

const Heder: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const ReduxState = useSelector((state: RootState) => {
    return {
      darkMode: state.theme.darkMode,
      token: state.user.token,
      isAdmin: state.user.user?.admin,
    };
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleDeleteAccount = (password: string) => {
    dispatch(deleteAccount(password) as any)
      .unwrap()
      .then((res: any) => {
        toast(res.message, {
          position: "top-right",
          type: "success",
          rtl: true,
          theme: "colored",
        });
        router.push("/login?redirect=lesson");
      })
      .catch((err: any) => {
        toast(err.message, {
          position: "top-right",
          type: "error",
          rtl: true,
          theme: "colored",
        });
      });
  };

  return (
    <div className="fixed bg-white dark:bg-[#475B63] w-full top-0 left-0 z-20">
      <DeleteAccountForm
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onSubmit={handleDeleteAccount}
      />
      <div className="w-full md:max-w-screen-md md:mx-auto">
        <ul className="flex gap-5 p-3 items-center justify-center md:justify-start">
          {ReduxState.token && (
            <>
              <li>
                <Link href="/lesson">صفحه اصلی</Link>
              </li>
              <HeaderDropdown title={<p className="disable-select">پروفایل</p>}>
                <ul className="flex flex-col gap-2 disable-select">
                  {ReduxState.isAdmin && (
                    <li className="flex items-center gap-2 cursor-pointer">
                      <MdPerson />
                      <Link href="/users">کاربران</Link>
                    </li>
                  )}
                  <li className="flex items-center gap-2 cursor-pointer">
                    <MdChangeCircle />
                    <Link href="/change-password">تغییر رمز عبور</Link>
                  </li>
                  <li
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <MdWest />
                    خروج از حساب کاربری
                  </li>
                  <li
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <MdBackspace />
                    حذف حساب کاربری
                  </li>
                </ul>
              </HeaderDropdown>
              <li>
                <Link href="/saved">نشان شده ها</Link>
              </li>
            </>
          )}
          <HeaderDropdown
            title={
              ReduxState.darkMode ? (
                <MdLightMode className="text-xl" />
              ) : (
                <MdDarkMode className="text-xl" />
              )
            }
          >
            <ul className="flex flex-col gap-2 disable-select">
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  dispatch(setMode("dark"));
                }}
              >
                <MdDarkMode />
                حالت تاریک
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  dispatch(setMode("light"));
                }}
              >
                <MdLightMode />
                حالت روشن
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  dispatch(setMode("auto"));
                }}
              >
                <MdBuild />
                سیستم
              </li>
            </ul>
          </HeaderDropdown>
        </ul>
      </div>
    </div>
  );
};

export default Heder;
