import React, { useRef } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface IProps {
  open: boolean;
  close: () => void;
  onSubmit: (content: string) => void;
  defaultContent?: string;
}

const AddComment: React.FC<IProps> = ({
  open,
  close,
  onSubmit,
  defaultContent,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const content = formData.get("content") as string;
      if (content) {
        onSubmit(content);
        close();
      }
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={() => {
        close();
      }}
    >
      <form
        dir="rtl"
        onSubmit={handleAddAnswer}
        ref={formRef}
        className="flex w-full min-h-screen md:min-h-fit items-start p-1 pt-5 md:p-5 md:max-w-screen-md bg-[#e8f0ff] dark:bg-[#2B373D] gap-5 justify-center md:items-center md:rounded-xl"
      >
        <div className="w-full flex items-start justify-start gap-4">
          <div className="flex flex-col items-stretch min-w-fit gap-5">
            <label className="min-w-fit" htmlFor="content">
              نظر:
            </label>
          </div>
          <div className="flex flex-col items-stretch gap-2.5 w-full">
            <textarea
              className="w-full md:w-11/12 border-none rounded-lg p-1.5 h-52 resize-none dark:bg-[#475B63]"
              id="content"
              name="content"
              defaultValue={defaultContent}
            />
            <div className="flex gap-5">
              <div className="w-1/2 sm:w-32">
                <Button
                  className="bg-[#F7F5FB] dark:bg-[#475B63] rounded-xl px-6"
                  type="submit"
                >
                  افزون نظر
                </Button>
              </div>
              <div className="w-1/2 sm:w-32">
                <Button
                  className="bg-[#F7F5FB] dark:bg-[#475B63] rounded-xl px-6"
                  onClick={() => {
                    close();
                  }}
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

export default AddComment;
