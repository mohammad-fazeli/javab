import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import SavedItem from "../components/SavedItem";
import AuthWrapper from "../components/AuthWrapper";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { removeSaved } from "../store/user/action";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { wrapper } from "../store/store";
import axios from "axios";
import { setSaved } from "../store/user/slice";
import { handleErrorServerSide } from "../utils/handleError";

const Saved: NextPage = () => {
  const dispatch = useDispatch();
  const ReduxState = useSelector((state: RootState) => {
    return {
      saved: state.user.saved,
      pending: state.user.pending,
    };
  });
  console.log("🚀 ~ file: saved.tsx ~ line 23 ~ ReduxState", ReduxState.saved);
  const [state, setState] = useState({
    search: "",
  });

  const handleClick = (_id: string) => {
    dispatch(removeSaved(_id) as any)
      .unwrap()
      .then((err: any) => {
        toast("تمرین از ذخیره شده ها حذف شد", {
          position: "top-right",
          type: "success",
          rtl: true,
          theme: "colored",
        });
      });
  };

  return (
    <AuthWrapper>
      <Head>
        <title>نشان شده ها</title>
      </Head>
      <div dir="rtl">
        {ReduxState.pending && <Loading />}
        <div className="min-h-[calc(100vh-57px)] px-3 md:border md:border-t-0 md:border-b-0 border-[#E1E1E1] dark:md:border-[#3D494C]">
          <div className="header">
            <h1>ذخیره شده ها:</h1>
          </div>
          {ReduxState.saved.length > 0 && (
            <input
              type="text"
              className="w-11/12 block mx-auto my-8 rounded-lg p-2 dark:bg-[#475B63] outline-none"
              placeholder="جستجوی تمرین..."
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
          {ReduxState.saved.length > 0 ? (
            <div className="flex flex-col gap-2">
              {ReduxState.saved
                .filter((lesson) =>
                  lesson.title
                    .toLowerCase()
                    .includes(state.search.toLowerCase())
                )
                .map((lesson) => (
                  <SavedItem
                    key={lesson._id}
                    title={lesson.title}
                    _id={lesson._id}
                    onClick={handleClick}
                  />
                ))}
            </div>
          ) : (
            <h3 className="text-center">هیچ تمرینی ذخیره نشده است</h3>
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/saved`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      store.dispatch(setSaved(response.data.data));
    } catch (err: any) {
      const response = await handleErrorServerSide(err, token, store);
      if (response === 401) {
        return {
          redirect: {
            destination: "/login?redirect=saved/",
            permanent: false,
          },
        };
      }
      if (typeof response != "number") {
        store.dispatch(setSaved(response.data.data));
      }
    }
    return {
      props: {},
    };
  }
);

export default Saved;
