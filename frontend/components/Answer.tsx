import Image from "next/image";
import React, { useState } from "react";
import { MdCreate, MdDelete, MdPerson } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  decreaseRate,
  deleteAnswer,
  editAnswer,
  increaseRate,
} from "../store/answer/action";
import { answer } from "../store/practice/slice";
import { RootState } from "../store/store";
import AddAnswerForm from "./AddAnswerForm";
import Button from "./Button";
import Text from "./Text";
import { useRouter } from "next/router";
import CommentList from "./CommentList";

interface IProps {
  answer: answer;
}

const Answer: React.FC<IProps> = ({ answer }) => {
  const [state, setState] = useState({
    openEdit: false,
    showComment: false,
  });
  const date = new Date(answer.createdAt);
  const dateString = date.toLocaleDateString("fa-IR");
  const fileFormat = answer.file?.split(".")[1];
  const dispatch = useDispatch();
  const router = useRouter();
  const ReduxState = useSelector((store: RootState) => {
    return {
      user: store.user.user,
    };
  });
  const canEdit = answer.createdBy === ReduxState.user?.name;

  const handleDelete = () => {
    if (window.confirm("آیا مطمئن هستید؟"))
      dispatch(deleteAnswer(answer._id) as any)
        .unwrap()
        .then((res: any) => {
          toast(res.message, {
            type: "success",
          });
        })
        .catch((err: any) => {
          toast(err.message, {
            type: "error",
          });
        });
  };

  const handleEdit = (e: FormData) => {
    dispatch(editAnswer({ answer: e, answer_id: answer._id }) as any)
      .unwrap()
      .then((res: any) => {
        toast(res.message, {
          type: "success",
        });
      })
      .catch((err: any) => {
        toast(err.message, {
          type: "error",
        });
      });
    setState((prevState) => ({
      ...prevState,
      openEdit: false,
    }));
  };

  const handleIncreaseRate = () => {
    dispatch(increaseRate(answer._id) as any);
  };
  const handleDecreaseRate = () => {
    dispatch(decreaseRate(answer._id) as any);
  };

  return (
    <>
      <AddAnswerForm
        isOpen={state.openEdit}
        onCancel={() => {
          setState((prevState) => {
            return {
              ...prevState,
              openEdit: false,
            };
          });
        }}
        onSubmit={handleEdit}
        defaultValue={{ description: answer.description, file: answer.file }}
      />
      <div className="flex justify-between gap-2.5 border-b border-b-[#E1E1E1] dark:border-b-[#3D494C] pb-2 mt-5 w-full">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 flex justify-center items-center bg-gray-400 rounded-full text-gray-800 text-4xl">
                <MdPerson />
              </div>
              <div className="flex flex-col items-start">
                <div>{answer.createdBy}</div>
                <div>{dateString}</div>
              </div>
            </div>
            <div className="text-2xl flex gap-1">
              {canEdit && (
                <>
                  <MdCreate
                    className="cursor-pointer"
                    onClick={() => {
                      setState((prevState) => {
                        return {
                          ...prevState,
                          openEdit: true,
                        };
                      });
                    }}
                  />
                  <MdDelete className="cursor-pointer" onClick={handleDelete} />
                </>
              )}
            </div>
          </div>
          <div className="py-2.5">
            {answer.file ? (
              fileFormat === "pdf" ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/practice/${answer.file}`}
                  target="_blank"
                  rel="noreferrer"
                  download={true}
                >
                  <Image
                    width={80}
                    height={100}
                    src="/pdf.png"
                    alt="pdf-file"
                  />
                </a>
              ) : (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/practice/${answer.file}`}
                  target="_blank"
                  rel="noreferrer"
                  download={true}
                >
                  <Image
                    layout="responsive"
                    width="100%"
                    height={60}
                    className="w-full"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/files/practice/${answer.file}`}
                    alt="image"
                  />
                </a>
              )
            ) : (
              ""
            )}
            <div className="mt-2">
              <Text text={answer.description || ""} />
            </div>
          </div>
          {state.showComment ? (
            <CommentList comments={answer.comments} answer_id={answer._id} />
          ) : (
            <div className="w-36">
              <Button
                className="bg-[#F7F5FB] dark:bg-[#475B63] rounded-xl px-5"
                onClick={() => {
                  setState((prevState) => {
                    return { ...prevState, showComment: true };
                  });
                }}
              >
                نمایش کامنت ها
              </Button>
            </div>
          )}
        </div>
        <div className="min-w-fit pt-16 text-center text-xl">
          <div
            className="border-l-[18px] border-r-[18px] border-b-[18px] border-b-slate-700 dark:border-b-gray-400 border-l-transparent border-r-transparent"
            onClick={handleIncreaseRate}
          />
          <span dir="ltr">{answer.rate}</span>
          <div
            className="border-l-[18px] border-r-[18px] border-t-[18px] border-t-slate-700 dark:border-t-gray-400 border-l-transparent border-r-transparent"
            onClick={handleDecreaseRate}
          />
        </div>
      </div>
    </>
  );
};

export default Answer;
