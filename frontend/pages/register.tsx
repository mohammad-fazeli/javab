import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { register } from "../store/user/action";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const Register: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const pending = useSelector((state: RootState) => state.user.pending);
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("نام کاربری خود را وارد کنید")
      .min(3, "نام کاربری باید بیش از 3 کاراکتر باشد")
      .max(20, "نام کاربری باید کمتر از 20 کاراکتر باشد"),
    email: Yup.string()
      .email("ایمیل نا معتبر است")
      .required("ایمیل خود را وارد کنید"),
    password: Yup.string()
      .min(6, "رمز عبور باید بیش از 6 کاراکتر باشد")
      .required("رمز عبور خود را وارد کنید"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "رمز عبور باید یکسان باشد")
      .required("رمز عبور را تکرار کنید"),
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (obj: any) => {
    await dispatch(
      register({
        name: obj.name,
        email: obj.email,
        password: obj.password,
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
        <title>ثبت نام</title>
      </Head>
      {pending && <Loading />}
      <div className="w-11/12 sm:w-96 bg-white dark:bg-[#475B63] rounded-xl shadow-lg dark:shadow-[#616161]">
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={onSubmitHandler}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" px-5 flex flex-col gap-3 ">
                <h2 className="text-center mt-4 text-xl">ایجاد حساب کاربری</h2>
                <div>
                  <label htmlFor="name">نام کاربری</label>
                  <TextField
                    name="name"
                    id="name"
                    type="text"
                    className={`bg-transparent border w-full px-3 py-2 rounded-lg placeholder:text-zinc-200 mt-2
                        ${
                          formik.errors.name && formik.touched.name
                            ? "outline-red-500 border-red-500"
                            : "outline-sky-400"
                        }
                    `}
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                </div>
                <div>
                  <label htmlFor="email">ایمیل</label>
                  <TextField
                    name="email"
                    id="email"
                    type="email"
                    className={`bg-transparent border w-full px-3 py-2 rounded-lg placeholder:text-zinc-200 mt-2
                        ${
                          formik.errors.name && formik.touched.name
                            ? "outline-red-500 border-red-500"
                            : "outline-sky-400"
                        }
                    `}
                    placeholder="ایمیل خود را وارد کنید"
                  />
                </div>
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
                    ثبت نام
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

export default Register;
