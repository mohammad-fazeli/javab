import React, { useState } from "react";
import Comment from "./Comment";
import AddComment from "./AddComment";
import { useDispatch } from "react-redux";
import { addComment } from "../store/answer/action";
import Button from "./Button";

interface IProps {
  answer_id: string;
  comments: any[];
}

const CommentList: React.FC<IProps> = ({ comments, answer_id }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleAddComment = (content: string) => {
    dispatch(addComment({ content, answer_id }) as any);
    setOpen(false);
  };
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
      <div className="w-32">
        <Button
          className="bg-[#F7F5FB] dark:bg-[#475B63] rounded-xl px-6"
          onClick={() => {
            setOpen(true);
          }}
        >
          افزودن نظر
        </Button>
      </div>
      <AddComment
        open={open}
        close={() => {
          setOpen(false);
        }}
        onSubmit={handleAddComment}
      />
    </div>
  );
};

export default CommentList;
