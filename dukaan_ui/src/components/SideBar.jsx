import MenuTop from './MenuTop'
import MenuItem from './MenuItem'
import MenuBottom from './MenuBottom';
import icons from '../assets/icons/icon';


export default function SideBar() {
  return (
    <div className= 'hidden md:visible bg-violet-500 md:sticky h-screen md:max-w-[224px] top-0 left-0 p-4 md:flex flex-col items-center'>
            <MenuTop />
            <div className = 'w-full px-2 mt-4  overflow-y-auto'>
                {
                    icons.map(i => <MenuItem key={i.name} name={i.name} icon={i.icon} className='hover:bg-opacity-50'/>)
                }
            </div>
            <div className='fixed bottom-0 mb-2'>
                <MenuBottom />
            </div>
        </div>
  )
}
