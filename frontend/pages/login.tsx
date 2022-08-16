import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/user/action";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loading from "../components/Loading";
import type { RootState } from "../store/store";
import { logout } from "../store/user/slice";

const Login: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const pending = useSelector((state: RootState) => state.user.pending);

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const router = useRouter();
  const redirect = router.query.redirect;

  useEffect(() => {
    if (redirect) {
      removeCookie("token");
      dispatch(logout());
    }
  }, [dispatch, redirect, removeCookie]);
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("ایمیل نا معتبر است")
      .required("ایمیل خود را وارد کنید"),
    password: Yup.string()
      .min(6, "رمز عبور باید بیش از 6 کاراکتر باشد")
      .required("رمز عبور خود را وارد کنید"),
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (obj: any) => {
    await dispatch(
      login({
        email: obj.email,
        password: obj.password,
      }) as any
    )
      .unwrap()
      .then((res: any) => {
        setCookie("token", res.token, { path: "/", maxAge: 60 * 60 * 24 });
        toast(res.message, {
          position: "top-right",
          type: "success",
          rtl: true,
          theme: "colored",
        });
        router.push(`/${redirect || "lesson"}`);
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
        <title>ورود به حساب کاربری</title>
      </Head>
      {pending && <Loading />}

      <div className="w-11/12 sm:w-96 bg-white dark:bg-[#475B63] rounded-xl shadow-lg dark:shadow-[#616161]">
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={onSubmitHandler}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" px-5 flex flex-col gap-3 ">
                <h2 className="text-center mt-4 text-xl">
                  ورود به حساب کاربری
                </h2>
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
                <div className="mt-3">
                  <Button
                    type="submit"
                    className="bg-red-500 dark:bg-blue-500 text-white"
                  >
                    ورود
                  </Button>
                </div>
                <div className="w-full h-px bg-zinc-200"></div>
                <div>
                  <Link href="/register">
                    <a className="block text-center pb-2">ایجاد حساب کاربری</a>
                  </Link>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-[#2B373D] rounded-b-xl py-1.5">
                <Link
                  href="/forget-password"
                  className="block text-center py-2"
                >
                  <a className="block text-center py-2">
                    رمزعبور خود را فراموشی کرده اید؟
                  </a>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
