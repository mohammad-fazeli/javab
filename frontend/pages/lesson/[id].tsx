import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { wrapper } from "../../store/store";
import AuthWrapper from "../../components/AuthWrapper";
import { setState } from "../../store/items/slice";
import { useSelector, useDispatch } from "react-redux";
import {
  addPractices,
  deletePractice,
  updateTitlePractice,
} from "../../store/practice/action";
import type { RootState } from "../../store/store";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ListItem from "../../components/ListItem";
import AddPracticeForm from "../../components/AddPracticeForm";
import Loading from "../../components/Loading";
import { handleErrorServerSide } from "../../utils/handleError";

const Lesson: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const ReduxState = useSelector((state: RootState) => {
    return {
      items: state.items.items,
      title: state.items.title,
      userLessons: state.user.user?.lessons || [],
      isAdmin: state.user.user?.admin || false,
      uploadPercent: state.items.uploadPercent,
      pending: state.items.pending,
    };
  });
  const [state, setState] = useState({
    search: "",
    addPractice: false,
  });
  const { id } = router.query;
  const canEdit =
    ReduxState.isAdmin || ReduxState.userLessons?.includes(id as string);

  const handleAddPractice = (formData: FormData) => {
    formData.append("lesson", id as string);
    dispatch(addPractices(formData) as any)
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
    setState((prevState) => {
      return {
        ...prevState,
        addPractice: false,
      };
    });
  };

  const handleUpdatePractice = ({
    _id,
    title,
  }: {
    _id: string;
    title: string;
  }) => {
    dispatch(updateTitlePractice({ _id, title }) as any)
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

  const handleDeletePractice = (_id: string) => {
    dispatch(deletePractice(_id) as any)
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

  return (
    <AuthWrapper>
      <Head>
        <title>{ReduxState.title}</title>
      </Head>
      {ReduxState.pending && <Loading percent={ReduxState.uploadPercent} />}
      <AddPracticeForm
        isOpen={state.addPractice}
        onSubmit={handleAddPractice}
        onCancel={() => {
          setState((prevState) => {
            return {
              ...prevState,
              addPractice: false,
            };
          });
        }}
      />
      <ListItem
        items={ReduxState.items}
        title={ReduxState.title || ""}
        canEdit={canEdit}
        addButtonText="افزودن تمرین"
        addFunction={() => {
          setState((prevState) => {
            return {
              ...prevState,
              addPractice: true,
            };
          });
        }}
        handleDeleteItem={handleDeletePractice}
        handleUpdateItem={handleUpdatePractice}
        to="practice"
      />
    </AuthWrapper>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const id = context.query.id;
    const token = context.req.headers.cookie?.replace("token=", "") || "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lesson/${id}`,
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
            destination: `/login?redirect=lesson/${id}`,
            permanent: false,
          },
        };
      } else if (typeof response != "number") {
        store.dispatch(
          setState({
            title: response.data.title || "",
            items: response.data.data,
          })
        );
      } else {
        return {
          redirect: {
            destination: "/lesson",
            permanent: false,
          },
        };
      }
    }
    return {
      props: {},
    };
  }
);

export default Lesson;
