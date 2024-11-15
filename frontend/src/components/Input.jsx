import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", placeholder = "give me placeHolder", ...props },
  ref
) {
  const id = useId();

  return (
    <div>
      <div className="relative mt-1 text-black w-96">
        <input
          ref={ref}
          type={type}
          id={id}
          className="block w-full h-10 pl-8 pr-3 mt-1 text-sm text-gray-700 border focus:outline-none rounded shadow-sm focus:border-blue-500"
          placeholder={placeholder}
          {...props}
        />
        <span className="absolute inset-y-0 left-0 flex items-center justify-center ml-2">
        </span>
      </div>
    </div>
  );
});

export default Input;