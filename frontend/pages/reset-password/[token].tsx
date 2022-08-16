import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { resetPassword } from "../../store/user/action";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const pending = useSelector((state: RootState) => state.user.pending);
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "رمزعبور باید بیشتر از 6 کاراکتر باشد")
      .max(15, "رمزعبور باید کمتر از 20 کاراکتر باشد")
      .required("رمز عبور را وارد کنید"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "رمز عبور با تکرار آن برابر نیست")
      .required("تکرار رمز عبور را وارد کنید"),
  });

  const token = router.query.token;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (obj: any) => {
    await dispatch(
      resetPassword({
        password: obj.password,
        token: token as string,
      }) as any
    )
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
        <title>تغییر رمزعبور</title>
      </Head>

      {pending && <Loading />}
      <div className="w-11/12 sm:w-96 bg-white dark:bg-[#475B63] rounded-xl shadow-lg dark:shadow-[#616161]">
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={onSubmitHandler}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" px-5 flex flex-col gap-3 ">
                <h2 className="text-center mt-4 text-xl">تغییر رمزعبور</h2>
                <div className="relative">
                  <label htmlFor="password">رمزعبور</label>
                  <TextField
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`bg-transparent border w-full px-3 py-2 rounded-lg placeholder:text-zinc-200 mt-2
                    ${
                      formik.errors.password && formik.touched.password
                        ? "outline-red-500 border-red-500"
                        : "outline-sky-400"
                    }
                    `}
                    placeholder="رمزعبور خود را وارد کنید"
                  />
                  {showPassword ? (
                    <MdVisibility
                      onClick={handleShowPassword}
                      className="absolute top-10  left-3 text-2xl cursor-pointer"
                    />
                  ) : (
                    <MdVisibilityOff
                      onClick={handleShowPassword}
                      className="absolute top-10  left-3 text-2xl cursor-pointer"
                    />
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="confirmPassword">تکرار رمزعبور</label>
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className={`bg-transparent border w-full px-3 py-2 rounded-lg placeholder:text-zinc-200 mt-2
                    ${
                      formik.errors.password && formik.touched.password
                        ? "outline-red-500 border-red-500"
                        : "outline-sky-400"
                    }
                    `}
                    placeholder="رمزعبور خود را تکرار کنید"
                  />
                  {showPassword ? (
                    <MdVisibility
                      onClick={handleShowPassword}
                      className="absolute top-10  left-3 text-2xl cursor-pointer"
                    />
                  ) : (
                    <MdVisibilityOff
                      onClick={handleShowPassword}
                      className="absolute top-10  left-3 text-2xl cursor-pointer"
                    />
                  )}
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

export default ResetPassword;
