import React from "react";

export default function MenuTop() {
  return (
    <div className="grid grid-cols-6 items-center gap-4 px-2 bg-violet-500 text-slate-50 cursor-pointer">
      <div className="col-span-2">
        <img src="src/assets/logo.png" />
      </div>
      <div className="col-span-3 flex flex-col justify-center items-start">
        <div className="text-base">
        Nishyan
        </div>
        <div className="text-sm text-gray-500 underline">
        Visit Store
        </div>
      </div>
      <div className="col-span-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  );
}
