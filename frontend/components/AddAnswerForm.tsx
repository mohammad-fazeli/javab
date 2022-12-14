import React, { useRef, useState } from "react";
import { formatBytes } from "../utils/formatBytes";
import Button from "./Button";
import Modal from "./Modal";

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  defaultValue?: {
    description?: string;
    file?: string;
  };
  onSubmit: (formDate: FormData) => void;
}

const AddAnswerForm: React.FC<IProps> = ({
  onSubmit,
  onCancel,
  isOpen,
  defaultValue,
}) => {
  const [state, setState] = useState({
    file: "",
    fileSize: 0,
    checked: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && state.fileSize < 3100000) {
      const formData = new FormData(formRef.current);
      onSubmit(formData);
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
        dir="rtl"
        onSubmit={handleAddAnswer}
        ref={formRef}
        className="flex w-full min-h-screen md:min-h-fit items-start p-1 pt-5 md:p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] gap-5 justify-center md:items-center md:rounded-xl"
      >
        <div className="w-full grid grid-cols-form gap-2">
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
            name="description"
            defaultValue={defaultValue?.description}
          />
          <div></div>
          <div className="flex gap-5">
            <div className="w-1/2 sm:w-32">
              <Button className="bg-[#F7F5FB] dark:bg-[#475B63]" type="submit">
                افزون پاسخ
              </Button>
            </div>
            <div className="w-1/2 sm:w-32">
              <Button
                className="bg-[#F7F5FB] dark:bg-[#475B63]"
                type="reset"
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

export default AddAnswerForm;
