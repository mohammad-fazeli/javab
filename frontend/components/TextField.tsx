import React from "react";
import { ErrorMessage, useField } from "formik";
import type { FieldHookConfig } from "formik";

interface IProps {
  name?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  className?: string;
}

const TextField: React.FC<IProps> = ({ type, ...props }) => {
  const [field] = useField(props as unknown as string);
  return (
    <div>
      <input type={type} autoComplete="off" {...field} {...props} />
      <ErrorMessage
        component="div"
        name={field.name}
        className="text-red-500 absolute "
      />
    </div>
  );
};

export default TextField;
