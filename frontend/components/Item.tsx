import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdMode } from "react-icons/md";
import Link from "next/link";

interface IProps {
  title: string;
  _id: string;
  to: string;
  canEdit: boolean;
  onEdit: (obj: { _id: string; title: string }) => void;
  onDelete: (id: string) => void;
}

const Item: React.FC<IProps> = ({
  title,
  _id,
  onDelete,
  onEdit,
  to,
  canEdit,
}) => {
  const [state, setState] = useState({
    isEdit: false,
    title: title,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditHandler = () => {
    setState((prevState) => {
      return {
        ...prevState,
        isEdit: true,
      };
    });
  };
  useEffect(() => {
    if (state.isEdit) {
      inputRef.current?.focus();
    }
  }, [state.isEdit]);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.blur();
    onEdit({ _id, title: state.title });
  };

  const onDeleteHandler = () => {
    if (window.confirm("Are you sure?")) onDelete(_id);
  };

  return (
    <div className="flex justify-between border-b border-b-[#E1E1E1] dark:border-b-[#3D494C] py-2">
      <div className={`${state.isEdit ? "hidden" : "block"}`}>
        <Link href={to}>{title}</Link>
      </div>
      <form
        onSubmit={onSubmitHandler}
        className={`w-full ${state.isEdit ? "block" : "hidden"}`}
      >
        <input
          className="dark:bg-[#475B63] w-full block rounded-lg px-4 outline-none"
          type="text"
          value={state.title}
          onChange={(e) => {
            setState((prevState) => {
              return {
                ...prevState,
                title: e.target.value,
              };
            });
          }}
          ref={inputRef}
          onBlur={() => {
            setState((prevState) => {
              return {
                ...prevState,
                isEdit: false,
                title,
              };
            });
          }}
        />
      </form>
      <div className="flex gap-2 text-xl">
        {canEdit && (
          <>
            <MdMode className="cursor-pointer" onClick={isEditHandler} />
            <MdDelete className="cursor-pointer" onClick={onDeleteHandler} />
          </>
        )}
      </div>
    </div>
  );
};

export default Item;
