import React from "react";

const Bgbutton = ({
  textContent,
  type = "submit",
  textColor = "text-white",
  hoverTextColor = "text-violet-500",
}) => {
  return (
    <>
      <button
        type={type}
        className="px-6 py-2 min-w-[120px] text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring"
      >
        {textContent}
      </button>
    </>
  );
};

const Borderbutton = ({ textContent }) => {

  return (
    <>
      <button
        type={type}
        className="px-6 py-2 min-w-[120px] text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring"
        >
        {textContent}
      </button>
    </>
  );
};

export { Bgbutton, Borderbutton };
