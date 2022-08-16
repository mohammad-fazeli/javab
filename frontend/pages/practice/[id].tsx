import axios from "axios";
import AuthWrapper from "../../components/AuthWrapper";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { wrapper } from "../../store/store";
import { setState } from "../../store/practice/slice";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import Question from "../../components/Question";
import Answer from "../../components/Answer";

const Practice: NextPage = () => {
  const router = useRouter();
  const state = useSelector((store: RootState) => {
    return {
      practice: store.practice.practice,
      answers: store.practice.answers,
      lessons: store.user.user?.lessons,
      isAdmin: store.user.user?.admin,
      pending: store.practice.pending,
    };
  });
  const { id } = router.query;
  const canEdit =
    state.isAdmin || state.lessons?.includes(id as string) || false;

  return (
    <AuthWrapper>
      <Head>
        <title>{state.practice.title}</title>
      </Head>
      <div>
        {state.pending && <Loading />}
        <div
          dir="rtl"
          className=" px-4 min-h-[calc(100vh-57px)] md:border md:border-t-0 md:border-b-0 border-[#E1E1E1] dark:md:border-[#3D494C]"
        >
          <Question practice={state.practice} canEdit={canEdit} />
          {state.answers?.map((answer: any) => (
            <Answer key={answer._id} answer={answer} />
          ))}
        </div>
      </div>
    </AuthWrapper>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const id = context.query.id;
    const token = context.req.headers.cookie?.replace("token=", "");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/practice/${id}`,
        {
          headers: {
            authorization: token || "",
          },
        }
      );
      store.dispatch(
        setState({
          practice: response.data.data.practice,
          answers: response.data.data.answers,
        })
      );
      return {
        props: {},
      };
    } catch (err: any) {
      if (err.response?.status === 401) {
        return {
          redirect: {
            destination: `/login?redirect=practice/${id}`,
            permanent: false,
          },
        };
      }
      return {
        redirect: {
          destination: "/lesson",
          permanent: false,
        },
      };
    }
  }
);

export default Practice;
