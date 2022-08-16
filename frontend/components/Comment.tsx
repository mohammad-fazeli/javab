import React, { useState } from "react";
import Text from "./Text";
import { MdDelete, MdCreate, MdReply } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { deleteComment, addComment, editComment } from "../store/answer/action";
import AddComment from "./AddComment";
import type { RootState } from "../store/store";
import type { commentType } from "../store/practice/slice";

interface IProps {
  comment: commentType;
}

const Comment: React.FC<IProps> = ({ comment }) => {
  const [state, setState] = useState({
    openEdit: false,
    openReply: false,
  });
  const dispatch = useDispatch();
  const date = new Date(comment.createdAt);
  const dateString = date.toLocaleDateString("fa-IR");
  const timeString = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const userName = useSelector((store: RootState) => store.user.user?.name);

  const handleDelete = () => {
    if (window.confirm("آیا از حذف نظر مطمئن هستید؟")) {
      dispatch(deleteComment(comment._id) as any);
    }
  };

  const handleEdit = (content: string) => {
    dispatch(editComment({ comment_id: comment._id, content }) as any);
  };

  const handleReply = (content: string) => {
    dispatch(addComment({ content, parent: comment._id }) as any);
  };

  return (
    <div
      className={`bg-[#A3E7FC] dark:bg-[#32908F] relative mb-5 rounded-lg py-1 px-2.5 max-w-fit text-sm 
      before:absolute before:-bottom-4 before:right-0 before:w-0 before:h-0 before:border-l-[17px] before:border-l-transparent
      before:border-r-0 before:border-t-[22px] before:border-t-[#A3E7FC] before:dark:border-t-[#32908F]
    `}
    >
      <AddComment // for edit comment
        open={state.openEdit}
        close={() => {
          setState((prevState) => {
            return {
              ...prevState,
              openEdit: false,
            };
          });
        }}
        onSubmit={handleEdit}
        defaultContent={comment.content}
      />
      <AddComment // for reply comment
        open={state.openReply}
        close={() => {
          setState((prevState) => {
            return {
              ...prevState,
              openReply: false,
            };
          });
        }}
        onSubmit={handleReply}
      />
      <div className="flex gap-4 items-center">
        <span>{comment.createdBy}</span>
        <div className="flex items-center gap-1">
          <span>{timeString}</span>
          <span>{dateString}</span>
        </div>
        <div className="text-xl  flex items-center gap-1">
          {comment.createdBy === userName && (
            <>
              <MdCreate
                className="cursor-pointer"
                onClick={() => {
                  setState((prevState) => {
                    return { ...prevState, openEdit: true };
                  });
                }}
              />
              <MdDelete className="cursor-pointer" onClick={handleDelete} />
            </>
          )}
          <MdReply
            className="cursor-pointer"
            onClick={() => {
              setState((prevState) => {
                return { ...prevState, openReply: true };
              });
            }}
          />
        </div>
      </div>
      {comment.replayTo && (
        <div className="">در پاسخ به {comment.replayTo}</div>
      )}
      <div className="text">
        <Text text={comment.content} />
      </div>
      {comment.edited && <p className="text-left">edited</p>}
    </div>
  );
};

export default Comment;
