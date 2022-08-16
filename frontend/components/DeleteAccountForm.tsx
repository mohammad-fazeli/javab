import React, { useRef } from "react";
import Button from "./Button";
import Modal from "./Modal";

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  defaultDescription?: string;
  onSubmit: (password: string) => void;
}

const DeleteAccountForm: React.FC<IProps> = ({
  onSubmit,
  onCancel,
  isOpen,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const password = formData.get("password") as string;
      if (password) {
        onSubmit(password);
      }
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
        <div className="w-full flex items-start justify-start gap-4">
          <div className="flex flex-col items-stretch min-w-fit gap-5">
            <label className="min-w-fit" htmlFor="password">
              رمزعبور:
            </label>
          </div>
          <div className="flex flex-col items-stretch gap-2.5 w-full">
            <input
              className="w-full md:w-11/12 border-none rounded-lg p-1.5  dark:bg-[#475B63]"
              type="text"
              id="password"
              name="password"
            />

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
                  className="bg-[#F7F5FB] dark:bg-[#475B63]"
                  type="reset"
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

export default DeleteAccountForm;
