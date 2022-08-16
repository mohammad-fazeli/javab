import React from "react";
import { MdTurnedInNot } from "react-icons/md";
import Link from "next/link";

interface IProps {
  title: string;
  _id: string;
  onClick: (id: string) => void;
}

const SavedItem: React.FC<IProps> = ({ _id, onClick, title }) => {
  return (
    <div className="flex py-2 items-center justify-between border-b border-b-[#E1E1E1] dark:border-b-[#3D494C]">
      <div>
        <Link href={`/practice/${_id}`}>{title}</Link>
      </div>
      <div>
        <MdTurnedInNot
          className="cursor-pointer text-2xl"
          onClick={() => {
            onClick(_id);
          }}
        />
      </div>
    </div>
  );
};

export default SavedItem;
