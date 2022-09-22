import React, { useRef, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { formatBytes } from "../utils/formatBytes";

interface IProps {
  isOpen: boolean;
  onSubmit: (e: FormData) => void;
  onCancel: () => void;
  defaultValue?: {
    title?: string;
    question?: string;
    description?: string;
    file?: string;
  };
}

const AddPracticeForm: React.FC<IProps> = ({
  isOpen,
  onSubmit,
  defaultValue,
  onCancel,
}) => {
  const [state, setState] = useState({
    file: "",
    fileSize: 0,
    checked: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddPractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      if (
        formData.get("title") &&
        formData.get("question") &&
        state.fileSize < 3100000
      ) {
        onSubmit(formData);
        cancel();
      }
    }
  };
  const cancel = () => {
    formRef.current?.reset();
    setState({ checked: false, file: "", fileSize: 0 });
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={cancel}>
      <form
        ref={formRef}
        onSubmit={handleAddPractice}
        dir="rtl"
        className="flex w-full min-h-screen md:min-h-fit items-start p-1 pt-5 md:p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] gap-5 justify-center md:items-center md:rounded-xl"
      >
        <div className="w-full grid grid-cols-form gap-2">
          <label htmlFor="title">عنوان سوال*:</label>
          <input
            className="border-none rounded-lg p-1.5 dark:bg-[#475B63]"
            type="text"
            id="title"
            defaultValue={defaultValue?.title}
            name="title"
          />
          <label htmlFor="question">صورت سوال*:</label>
          <input
            className="border-none rounded-lg p-1.5 dark:bg-[#475B63]"
            type="text"
            id="question"
            defaultValue={defaultValue?.question}
            name="question"
          />
          <label htmlFor="file">فایل:</label>
          <div className="flex flex-col gap-2 md:gap-2 md:items-center md:flex-row">
            <input
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  file: e.target.value,
                  fileSize: e.target.files?.[0]?.size || 0,
                }));
              }}
              type="file"
              id="file"
              name="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
            />
            {state.fileSize > 0 && (
              <div>حجم فایل: {formatBytes(state.fileSize)}</div>
            )}
            {defaultValue?.file && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.file ? true : state.checked}
                  onChange={() => {
                    if (!state.file) {
                      setState((prevState) => ({
                        ...prevState,
                        checked: !state.checked,
                      }));
                    }
                  }}
                  name="deleteFile"
                  id="deleteFile"
                />
                <label htmlFor="deleteFile">حذف فایل قبلی</label>
              </div>
            )}
          </div>
          <label htmlFor="description">توضیحات:</label>
          <textarea
            className="border-none rounded-lg p-1.5 h-52 resize-none dark:bg-[#475B63]"
            id="description"
            defaultValue={defaultValue?.description}
            name="description"
          />
          <div></div>
          <div className="flex gap-5">
            <div className="w-1/2 sm:w-32">
              <Button className="bg-[#F7F5FB] dark:bg-[#475B63]" type="submit">
                ارسال
              </Button>
            </div>
            <div className="w-1/2 sm:w-32">
              <Button
                type="reset"
                className="bg-[#F7F5FB] dark:bg-[#475B63]"
                onClick={cancel}
              >
                لغو
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddPracticeForm;
