import { useState } from "react";

const ExpandCard = ({ content, contentName }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {expanded ? (
        <div
          className="p-2 border border-gray-300 rounded-lg mb-6 shadow-sm w-full"
          onClick={() => setExpanded(false)}
        >
          {content}
        </div>
      ) : (
        <div
          className="border border-gray-300 rounded-lg py-1 shadow-md w-full flex flex-row hover:bg-gray-100/70
                transform transition-transform duration-200 ease-out hover:scale-[1.02]"
          onClick={() => setExpanded(true)}
        >
          <p className="font-semibold cursor-pointer flex items-start px-2">
            {contentName}
          </p>
          <p className="ml-auto flex items-end px-2">Expand</p>
        </div>
      )}
    </>
  );
};

export default ExpandCard;
