
import React from 'react'

export default function OvalButtons({text,count,bgColor}) {
  return (
    <div className={`flex justify-center items-center border-1 rounded-full py-2 px-4 font-semibold ${bgColor == 'bg-grey-700' ? 'text-grey-500' : `text-slate-50`} ${bgColor}`}>
        <div>{`${text} ( ${count} )`}</div>
    </div>
  )
}
