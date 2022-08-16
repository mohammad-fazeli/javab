import React, { useRef, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface IProps {
  isOpen: boolean;
  onSubmit: (e: FormData) => void;
  onCancel: () => void;
  defaultValue?: {
    title?: string;
    question?: string;
    description?: string;
  };
}

const AddPracticeForm: React.FC<IProps> = ({
  isOpen,
  onSubmit,
  defaultValue,
  onCancel,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddPractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      if (formData.get("title") && formData.get("question")) {
        onSubmit(formData);
        formRef.current?.reset();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <form
        ref={formRef}
        onSubmit={handleAddPractice}
        dir="rtl"
        className="flex w-full min-h-screen md:min-h-fit items-start p-1 pt-5 md:p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] gap-5 justify-center md:items-center md:rounded-xl"
      >
        <div className="w-full flex items-start justify-start gap-2 md:gap-4">
          <div className=" flex flex-col items-stretch min-w-fit gap-5">
            <label className="min-w-fit" htmlFor="title">
              عنوان سوال*:
            </label>
            <label className="min-w-fit" htmlFor="question">
              صورت سوال*:
            </label>
            <label className="min-w-fit" htmlFor="file">
              فایل:
            </label>
            <label className="min-w-fit" htmlFor="description">
              توضیحات:
            </label>
          </div>
          <div className="flex flex-col items-stretch w-full gap-2.5 ">
            <input
              className="w-full md:w-11/12 border-none rounded-lg p-1.5 dark:bg-[#475B63]"
              type="text"
              id="title"
              defaultValue={defaultValue?.title}
              name="title"
            />
            <input
              className="w-full md:w-11/12 border-none rounded-lg p-1.5 dark:bg-[#475B63]"
              type="text"
              id="question"
              defaultValue={defaultValue?.question}
              name="question"
            />
            <input
              className="w-full"
              type="file"
              id="file"
              name="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
            />
            <textarea
              className="w-full md:w-11/12 border-none rounded-lg p-1.5 h-52 resize-none dark:bg-[#475B63]"
              id="description"
              defaultValue={defaultValue?.description}
              name="description"
            />
            <p className="text-xs">فیلد های ستاره دار ضروری هستند</p>
            <div className="flex gap-5">
              <div className="w-1/2 sm:w-32">
                <Button
                  className="bg-[#F7F5FB] dark:bg-[#475B63]"
                  type="submit"
                >
                  ارسال
                </Button>
              </div>
              <div className="w-1/2 sm:w-32">
                <Button
                  type="reset"
                  className="bg-[#F7F5FB] dark:bg-[#475B63]"
                  onClick={onCancel}
                >
                  لغو
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddPracticeForm;
