import React, { useRef, useState } from "react";
import type { practice } from "../store/practice/slice";
import {
  MdCreate,
  MdDelete,
  MdPerson,
  MdRemoveRedEye,
  MdTurnedIn,
} from "react-icons/md";
import Button from "./Button";
import { deletePractice, updatePractice } from "../store/practice/action";
import AddPracticeForm from "./AddPracticeForm";
import { addAnswer } from "../store/answer/action";
import { addSaved } from "../store/user/action";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Text from "./Text";
import { toast } from "react-toastify";
import Image from "next/image";
import AddAnswerForm from "./AddAnswerForm";

interface IProps {
  practice: practice;
  canEdit: boolean;
}

const Question: React.FC<IProps> = ({ canEdit, practice }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [state, setState] = useState({
    edit: false,
    addAnswer: false,
  });

  const date = new Date(practice.createdAt);
  const dateString = date.toLocaleDateString("fa-IR");
  const fileFormat = practice.file?.split(".")[1];

  const handleDelete = () => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      dispatch(deletePractice(practice._id as string) as any)
        .unwrap()
        .then((res: any) => {
          toast(res.message, {
            type: "success",
          });
          router.push(`/lesson/${practice.lesson}`);
        })
        .catch((err: any) => {
          toast(err.message, {
            type: "error",
          });
          if (err.status === 401) {
            router.push(`/login?redirect=practice/${practice._id}`);
          }
        });
    }
  };

  const handleEditLesson = (formData: FormData) => {
    formData.append("_id", practice._id);
    dispatch(updatePractice(formData) as any)
      .unwrap()
      .then((res: any) => {
        router.reload();
      })
      .catch((err: any) => {
        toast(err.message, {
          type: "error",
        });
        if (err.status === 401) {
          router.push(`/login?redirect=practice/${practice._id}`);
        }
      });
    setState((prevState) => {
      return {
        ...prevState,
        edit: false,
      };
    });
  };

  const handleSave = () => {
    dispatch(addSaved(practice._id as string) as any)
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
        if (err.status === 401) {
          router.push(`/login?redirect=practice/${practice._id}`);
        }
      });
  };

  const handleAddAnswer = (e: FormData) => {
    e.append("practice_id", practice._id);
    dispatch(addAnswer(e) as any)
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
        if (err.status === 401) {
          router.push(`/login?redirect=practice/${practice._id}`);
        }
      });
    setState((prevState) => ({
      ...prevState,
      addAnswer: false,
    }));
  };
  return (
    <>
      <AddPracticeForm
        isOpen={state.edit}
        onSubmit={handleEditLesson}
        onCancel={() => {
          setState((prevState) => {
            return {
              ...prevState,
              edit: false,
            };
          });
        }}
        defaultValue={{
          title: practice.title,
          question: practice.question,
          description: practice.description,
          file: practice.file,
        }}
      />
      <AddAnswerForm
        isOpen={state.addAnswer}
        onSubmit={handleAddAnswer}
        onCancel={() => {
          setState((prevState) => {
            return {
              ...prevState,
              addAnswer: false,
            };
          });
        }}
      />
      <div className="border-b border-b-[#E1E1E1] dark:border-b-[#3D494C] pb-5">
        <div className="border-b border-b-[#E1E1E1] dark:border-b-[#3D494C] pb-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-gray-400 rounded-full text-4xl p-1 text-gray-800">
                <MdPerson />
              </div>
              <div className="flex flex-col items-start">
                <span className="flex gap-2.5">{practice.createdBy}</span>
                <span className="flex gap-2.5">
                  <span className="flex gap-2.5">{dateString}</span>
                  <span className="flex items-center gap-1">
                    <MdRemoveRedEye className="text-xl " />
                    {practice.views}
                  </span>
                </span>
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
                          edit: true,
                        };
                      });
                    }}
                  />
                  <MdDelete className="cursor-pointer" onClick={handleDelete} />
                </>
              )}
              <MdTurnedIn className="cursor-pointer" onClick={handleSave} />
            </div>
          </div>
          <p>{practice.question}</p>
        </div>
        <div className="py-2.5">
          <div>
            {practice.file ? (
              fileFormat === "pdf" ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/practice/${practice.file}`}
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
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/practice/${practice.file}`}
                  target="_blank"
                  rel="noreferrer"
                  download={true}
                >
                  <Image
                    layout="responsive"
                    width="100%"
                    height={60}
                    className="w-full"
                    priority={true}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/files/practice/${practice.file}`}
                    alt="image"
                  />
                </a>
              )
            ) : (
              ""
            )}
          </div>
          <div className="description">
            <Text text={practice.description} />
          </div>
        </div>
        <div className="flex justify-end">
          <div>
            <Button
              className="bg-[#F7F5FB] dark:bg-[#475B63] rounded-xl px-6"
              onClick={() => {
                setState((prevState) => {
                  return { ...prevState, addAnswer: true };
                });
              }}
            >
              پاسخ دادن
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Question;
