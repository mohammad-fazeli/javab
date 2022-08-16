import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { wrapper } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";
import { persistStore } from "redux-persist";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../components/Loading";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore();
  const persistor = persistStore(store, {}, function persist() {
    persistor.persist();
  });
  NProgress.configure({ showSpinner: false });
  Router.events.on("routeChangeStart", (url) => {
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done();
  });

  return (
    <>
      <React.StrictMode>
        <PersistGate persistor={persistor} loading={<Loading />}>
          <Layout>
            <CookiesProvider>
              <ToastContainer position="top-right" rtl={true} theme="colored" />
              <Component {...pageProps} />
            </CookiesProvider>
          </Layout>
        </PersistGate>
      </React.StrictMode>
    </>
  );
}

export default wrapper.withRedux(MyApp);
