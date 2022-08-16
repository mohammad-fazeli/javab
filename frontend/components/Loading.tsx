import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
  return (
    <div className="fixed z-50 top-0 right-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 w-full h-screen flex justify-center items-center">
      <ReactLoading type="bars" color="#e3364e" height="100px" width="100px" />
    </div>
  );
};

export default Loading;
