import React from "react";

interface IProps {
  text: string;
}

const Text: React.FC<IProps> = ({ text }) => {
  return (
    <div>
      {text.split("\n").map((line, index) => {
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
};

export default Text;
