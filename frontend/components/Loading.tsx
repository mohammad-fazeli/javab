import React from "react";
import ReactLoading from "react-loading";

interface IProps {
  percent?: number;
}

const Loading: React.FC<IProps> = ({ percent = 0 }) => {
  return (
    <div className="fixed z-50 top-0 right-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 w-full h-screen flex justify-center items-center">
      <ReactLoading
        type="spinningBubbles"
        color="#e3364e"
        height="100px"
        width="100px"
      />
      {percent > 0 && (
        <span className="absolute text-2xl text-red-500">
          {percent < 99 ? percent : 99}%
        </span>
      )}
    </div>
  );
};

export default Loading;
