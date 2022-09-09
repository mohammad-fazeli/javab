import React, { useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { wrapper } from "../../store/store";
import AuthWrapper from "../../components/AuthWrapper";
import { setState } from "../../store/items/slice";
import { useSelector, useDispatch } from "react-redux";
import {
  addLesson,
  deleteLesson,
  updateLesson,
} from "../../store/lesson/action";
import type { RootState } from "../../store/store";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ListItem from "../../components/ListItem";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { handleErrorServerSide } from "../../store/utils/handleError";

const Lessons: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ReduxState = useSelector((state: RootState) => {
    return {
      items: state.items.items,
      isAdmin: state.user.user?.admin || false,
      pending: state.items.pending,
    };
  });
  const [state, setState] = useState({
    search: "",
    addLesson: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const title = formData.get("title") as string;
      if (title) {
        dispatch(addLesson(title) as any)
          .unwrap()
          .then((res: any) => {
            toast(res.message, {
              position: "top-right",
              type: "success",
              rtl: true,
              theme: "colored",
            });
          })
          .catch((err: any) => {
            console.log("🚀 ~ file: lesson.tsx ~ line 42 ~ err", err);
            toast(err.message, {
              position: "top-right",
              type: "error",
              rtl: true,
              theme: "colored",
            });
          });
        formRef.current?.reset();
        setState((prevState) => {
          return {
            ...prevState,
            name: "",
            addLesson: false,
          };
        });
      }
    }
  };

  const handleUpdateLesson = ({
    _id,
    title,
  }: {
    _id: string;
    title: string;
  }) => {
    dispatch(updateLesson({ _id, title }) as any)
      .unwrap()
      .then((res: any) => {
        toast(res.message, {
          position: "top-right",
          type: "success",
          rtl: true,
          theme: "colored",
        });
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

  const handleDeleteLesson = (_id: string) => {
    dispatch(deleteLesson(_id) as any)
      .unwrap()
      .then((res: any) => {
        toast(res.message, {
          position: "top-right",
          type: "success",
          rtl: true,
          theme: "colored",
        });
      })
      .catch((err: any) => {
        console.log("🚀 ~ file: lesson.tsx ~ line 42 ~ err", err);
        toast(err.message, {
          position: "top-right",
          type: "error",
          rtl: true,
          theme: "colored",
        });
      });
  };

  return (
    <AuthWrapper>
      <Head>
        <title>لیست دروس</title>
      </Head>
      <Modal
        isOpen={state.addLesson}
        onRequestClose={() => {
          setState((prevState) => {
            return {
              ...prevState,
              addLesson: false,
            };
          });
        }}
      >
        <form
          ref={formRef}
          onSubmit={handleAddLesson}
          dir="rtl"
          className="flex w-screen min-h-screen md:min-h-fit items-start p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] gap-5 justify-center md:items-center md:rounded-xl"
        >
          <div className="w-full flex items-start justify-start gap-4">
            <div className="flex flex-col items-stretch min-w-fit gap-5">
              <label className="min-w-fit" htmlFor="title">
                نام درس
              </label>
            </div>
            <div className="flex flex-col items-stretch gap-2.5 w-full">
              <input
                className="w-full md:w-11/12 border-none rounded-lg p-1.5 dark:bg-[#475B63]"
                type="text"
                id="title"
                name="title"
              />
              <div className="flex gap-5">
                <div className="w-1/2 sm:w-32">
                  <Button
                    className="bg-[#F7F5FB] dark:bg-[#475B63]"
                    type="submit"
                  >
                    ارسال{" "}
                  </Button>
                </div>
                <div className="w-1/2 sm:w-32">
                  <Button
                    type="reset"
                    className="bg-[#F7F5FB] dark:bg-[#475B63]"
                    onClick={() => {
                      setState((prevState) => {
                        return {
                          ...prevState,
                          addLesson: false,
                        };
                      });
                    }}
                  >
                    لغو
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      {ReduxState.pending && <Loading />}
      <ListItem
        items={ReduxState.items}
        title="لیست دروس"
        canEdit={ReduxState.isAdmin}
        addButtonText="افزودن درس"
        addFunction={() => {
          setState((prevState) => {
            return {
              ...prevState,
              addLesson: true,
            };
          });
        }}
        handleDeleteItem={handleDeleteLesson}
        handleUpdateItem={handleUpdateLesson}
        to="lesson"
      />
    </AuthWrapper>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const token = context.req.headers.cookie?.replace("token=", "") || "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lesson`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      store.dispatch(
        setState({
          title: response.data.title || "",
          items: response.data.data,
        })
      );
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
        store.dispatch(
          setState({
            title: response.data.title || "",
            items: response.data.data,
          })
        );
      }
    }
    return {
      props: {},
    };
  }
);

export default Lessons;
