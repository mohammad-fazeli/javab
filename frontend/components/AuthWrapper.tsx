import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useRouter } from "next/router";

interface IProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const AuthWrapper: React.FC<IProps> = ({ children, isAdmin = false }) => {
  const router = useRouter();
  const state = useSelector((state: RootState) => {
    return {
      isLoggedIn: state.user.token,
      isAdmin: state.user.user?.admin,
    };
  });
  useEffect(() => {
    if (!state.isLoggedIn) {
      router.push("/login?redirect=lesson");
    }
    if (isAdmin && !state.isAdmin) {
      router.push("/login?redirect=lesson");
    }
  }, [isAdmin, router, state]);
  return <>{children}</>;
};

export default AuthWrapper;
