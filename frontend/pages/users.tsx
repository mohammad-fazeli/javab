import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import AuthWrapper from "../components/AuthWrapper";
import { RootState, wrapper } from "../store/store";
import axios from "axios";
import { setUsers } from "../store/users/slice";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import UserLessonsForm from "../components/UserLessonsForm";
import { handleErrorServerSide } from "../utils/handleError";

const Users: NextPage = () => {
  const ReduxState = useSelector((state: RootState) => {
    return {
      users: state.users.users,
      pending: state.users.pending,
    };
  });
  const [state, setState] = useState({
    search: "",
    userId: "",
    isOpen: false,
  });
  return (
    <AuthWrapper isAdmin={true}>
      <Head>
        <title>Users</title>
      </Head>
      <UserLessonsForm
        _id={state.userId || null}
        isOpen={state.isOpen}
        onCancel={() => {
          setState((prev) => ({ ...prev, isOpen: false }));
        }}
        onSubmit={(formData) => {}}
      ></UserLessonsForm>
      <div dir="rtl">
        {ReduxState.pending && <Loading />}
        <div className="min-h-[calc(100vh-57px)] px-3 md:border md:border-t-0 md:border-b-0 border-[#E1E1E1] dark:md:border-[#3D494C]">
          <div className="header">
            <h1>کاربران:</h1>
          </div>
          {ReduxState.users.length > 0 && (
            <input
              type="text"
              className="w-11/12 block mx-auto my-8 rounded-lg p-2 dark:bg-[#475B63] outline-none"
              placeholder="جستجوی نام کاربر..."
              value={state.search}
              onChange={(e) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    search: e.target.value,
                  };
                });
              }}
            />
          )}
          {ReduxState.users.length > 0 && (
            <div className="flex flex-col gap-2">
              {ReduxState.users
                .filter((user) =>
                  user.name.toLowerCase().includes(state.search.toLowerCase())
                )
                .map((user) => (
                  <div
                    key={user._id}
                    onClick={() => {
                      setState((prevState) => {
                        return {
                          ...prevState,
                          userId: user._id,
                          isOpen: true,
                        };
                      });
                    }}
                    className="flex py-2 items-center justify-between border-b border-b-[#E1E1E1] dark:border-b-[#3D494C] cursor-pointer"
                  >
                    {user.name}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const token = context.req.headers.cookie?.replace("token=", "") || "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      store.dispatch(setUsers(response.data.data));
    } catch (err: any) {
      const response = await handleErrorServerSide(err, token, store);
      if (response === 401) {
        return {
          redirect: {
            destination: "/login?redirect=lesson/",
            permanent: false,
          },
        };
      }
      if (typeof response != "number") {
        store.dispatch(setUsers(response.data.data));
      }
    }
    return {
      props: {},
    };
  }
);
export default Users;
