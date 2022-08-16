import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useRouter } from "next/router";
import { wrapper } from "../store/store";

const Home: NextPage<any> = ({}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/lesson");
    } else {
      router.push("/login");
    }
  }, [router, user]);
  return <div></div>;
};

export default Home;
