
import React from 'react'

export default function MenuItem({
  name,
  icon
}) {
  return (
    <div className='flex justify-start items-center cursor-pointer hover:bg-[#FFFFFF]/10 py-2 px-2 rounded-xl'>
      <div className='mr-2'>
           {icon}
      </div>
      <div className='text-slate-50 font-semibold'>
        {name}
      </div>
    </div>
  )
}





