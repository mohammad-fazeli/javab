import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useRouter } from "next/router";

interface IProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<IProps> = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=lesson");
    }
  }, [router, user]);
  return <>{children}</>;
};

export default AuthWrapper;
