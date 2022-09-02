import React, { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { wrapper } from "../../store/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/user/slice";
import { useCookies } from "react-cookie";

interface IProps {
  message: string;
  error: boolean;
  user: any | null;
  token: string | null;
}

const Verify: NextPage<IProps> = ({ message, error, user, token }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["token"]);
  useEffect(() => {
    if (user) {
      setCookie("token", token, { path: "/", maxAge: 60 * 60 * 24 });
      dispatch(setUser({ user, token }));
      router.push("/lesson");
    }
  }, [dispatch, router, setCookie, token, user]);
  return (
    <div className="w-full h-[calc(100vh-57px)] flex justify-center items-center">
      <Head>
        <title>تایید حساب کاربری</title>
      </Head>
      <div
        className={`p-3 rounded-lg text-white ${
          error ? "bg-red-500" : "bg-green-600"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify/${context.query.token}`
      );
      return {
        props: {
          error: false,
          message: response.data.message,
          user: response.data.user,
          token: response.data.token,
        },
      };
    } catch (err: any) {
      return {
        props: {
          error: true,
          message: err.response.data.message,
          user: null,
          token: null,
        },
      };
    }
  }
);

export default Verify;
