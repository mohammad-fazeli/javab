import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { forgotPassword } from "../store/user/action";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const ForgetPassword: NextPage = () => {
  const dispatch = useDispatch();
  const pending = useSelector((state: RootState) => state.user.pending);
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("ایمیل نا معتبر است")
      .required("ایمیل خود را وارد کنید"),
  });
  const onSubmitHandler = async (obj: any) => {
    await dispatch(forgotPassword(obj.email) as any)
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
    <div
      dir="rtl"
      className="flex flex-col justify-center items-center min-h-[calc(100vh-57px)]"
    >
      <Head>
        <title>فراموشی رمز عبور</title>
      </Head>
      {pending && <Loading />}
      <div className="w-11/12 sm:w-96 bg-white dark:bg-[#475B63] rounded-xl shadow-lg dark:shadow-[#616161]">
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={onSubmitHandler}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" px-5 flex flex-col gap-3 ">
                <h2 className="text-center mt-4 text-xl">بازیابی رمزعبور</h2>
                <div>
                  <label htmlFor="email">ایمیل</label>
                  <TextField
                    name="email"
                    id="email"
                    type="email"
                    className={`bg-transparent border w-full px-3 py-2 rounded-lg placeholder:text-zinc-200 mt-2
                        ${
                          formik.errors.email && formik.touched.email
                            ? "outline-red-500 border-red-500"
                            : "outline-sky-400"
                        }
                    `}
                    placeholder="ایمیل خود را وارد کنید"
                  />
                </div>
                <div className="mt-3">
                  <Button
                    type="submit"
                    className="bg-red-500 dark:bg-blue-500 text-white"
                  >
                    ارسال
                  </Button>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-[#2B373D] rounded-b-xl py-1.5 mt-3">
                <Link href="/login" className="block text-center py-2">
                  <a className="block text-center py-2">ورود به حساب کاربری</a>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;
