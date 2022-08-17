import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { MdOutlineClose, MdOutlineCropSquare } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons, setLessons } from "../store/users/action";
import { addLesson, removeLesson } from "../store/users/slice";
import { RootState } from "../store/store";
import { toast } from "react-toastify";

interface IProps {
  isOpen: boolean;
  _id: string | null;
  onCancel: () => void;
  onSubmit: (formDate: FormData) => void;
}

const UserLessonsForm: React.FC<IProps> = ({
  onSubmit,
  onCancel,
  isOpen,
  _id,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (_id) {
      dispatch(fetchLessons(_id) as any);
    }
  }, [_id, dispatch]);
  const ReduxState = useSelector((state: RootState) => {
    return {
      userLessons: state.users.userLessons,
      allLessons: state.users.allLessons,
    };
  });
  const [search, setSearch] = useState("");
  const handleSetLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const lessonsId = ReduxState.userLessons.map((lesson) => lesson._id);
    if (_id) {
      dispatch(setLessons({ userId: _id, lessonsId }) as any)
        .unwrap()
        .then((res: any) => {
          toast(res.message, {
            position: "top-right",
            type: "success",
            rtl: true,
            theme: "colored",
          });
          onCancel();
        })
        .catch((err: any) => {
          toast(err.message, {
            position: "top-right",
            type: "success",
            rtl: true,
            theme: "colored",
          });
        });
    }
  };
  const handleAddLesson = (lesson: { _id: string; title: string }) => {
    dispatch(addLesson(lesson));
  };
  const handleRemoveLesson = (lesson: { _id: string; title: string }) => {
    dispatch(removeLesson(lesson));
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <form
        dir="rtl"
        onSubmit={handleSetLesson}
        ref={formRef}
        className="flex flex-col w-full min-h-screen md:min-h-fit md:max-h-[90vh]  p-1 pt-5 md:p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] md:rounded-xl"
      >
        <div>
          <h1 className="mb-2">دروس کاربر:</h1>
          <div className="flex gap-2 flex-wrap max-h-[30vh] overflow-auto">
            {ReduxState.userLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="border border-[#E1E1E1] dark:md:border-[#3D494C] px-2 py-1 rounded-xl flex items-center gap-2 cursor-pointer"
                onClick={() => handleRemoveLesson(lesson)}
              >
                <MdOutlineClose />
                {lesson.title}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 flex items-center gap-8">
            <h1>تمام دروس:</h1>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="text"
              className="w-3/4 rounded-lg p-2 dark:bg-[#475B63] outline-none"
              placeholder="جستجو..."
            />
          </div>
          <div className="max-h-[30vh] overflow-auto pb-2">
            {ReduxState.allLessons
              .filter(
                (lesson) =>
                  lesson.title.includes(search) || lesson.title.includes(search)
              )
              .map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex items-center gap-2 py-1 border-b cursor-pointer border-b-[#E1E1E1] dark:border-b-[#3D494C]"
                  onClick={() => {
                    handleAddLesson(lesson);
                  }}
                >
                  <MdOutlineCropSquare />
                  {lesson.title}
                </div>
              ))}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-1/2 sm:w-32">
            <Button className="bg-[#F7F5FB] dark:bg-[#475B63]" type="submit">
              ثبت
            </Button>
          </div>
          <div className="w-1/2 sm:w-32">
            <Button
              onClick={onCancel}
              className="bg-[#F7F5FB] dark:bg-[#475B63]"
            >
              لغو
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserLessonsForm;
