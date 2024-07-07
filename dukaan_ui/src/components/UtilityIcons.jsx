import React from "react";

export default function UtilityIcons({title,children}) {
  return (
    <div className="border-2 flex justify-center items-center p-1 text-grey-500">
      {title ? <div className="mr-2 text-md items-center">{title}</div> : null}
      <div>
        {children}
      </div>
    </div>
  );
}
