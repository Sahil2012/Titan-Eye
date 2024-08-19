
import React from 'react'

export default function OvalButtons({text,count,bgColor,filterMe}) {
  return (
    <div 
  className={`flex justify-center items-center border-1 rounded-full py-2 px-4  sm:font-normal md:font-normal lg:font-semibold ${bgColor === 'bg-grey-700' ? 'text-grey-500' : 'text-slate-50'} ${bgColor} cursor-pointer 
    sm:py-1 sm:px-2 sm:text-[10px] 
    md:py-2 md:px-4 md:text-xs
    lg:py-2 lg:px-4 lg:text-base`} 
  onClick={filterMe}
>
  <div className='sm:text-xs md:text-base lg:text-base'>{`${text} (${count})`}</div>
</div>

  )
}
