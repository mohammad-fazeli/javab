import React, { useRef, useState } from "react";
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
    checked: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      onSubmit(formData);
    }
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <form
        dir="rtl"
        onSubmit={handleAddAnswer}
        ref={formRef}
        className="flex w-full min-h-screen md:min-h-fit items-start p-1 pt-5 md:p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] gap-5 justify-center md:items-center md:rounded-xl"
      >
        <div className="w-full grid grid-cols-form gap-2">
          <label htmlFor="file">فایل:</label>
          <div className="flex flex-col gap-2 md:gap-0 md:flex-row">
            <input
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  file: e.target.value,
                }));
              }}
              type="file"
              id="file"
              name="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
            />
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
                onClick={onCancel}
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
