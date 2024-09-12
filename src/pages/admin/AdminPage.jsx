import { BaseTemplate } from "../Templates";
import { FaUser } from "react-icons/fa";
import { FaToolbox, FaBoxesStacked } from "react-icons/fa6";
import { IoHardwareChipSharp } from "react-icons/io5";
import { MdPointOfSale } from "react-icons/md";

export default function AdminPage(){
    document.title = 'Admin Panel';

    return(
        <BaseTemplate>
            <section className='flex flex-1 justify-center'>
                <div className='flex w-[75%]'>
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 w-full text-[1.25rem]'>
                        <PanelButton url={'users'} text={'Users'} color={'bg-rose-200'}>
                            <FaUser className='flex text-[10em]' />
                        </PanelButton>
                        <PanelButton url={'products'} text={'Products'} color={'bg-orange-200'}>
                            <IoHardwareChipSharp className='flex text-[10em]' />
                        </PanelButton>
                        <PanelButton url={'users'} text={'Sales'} color={'bg-indigo-200'}>
                            <MdPointOfSale className="flex text-[10em]" />
                        </PanelButton>
                        <PanelButton url={'orders'} text={'Orders'} color={'bg-purple-200'}>
                            <FaBoxesStacked className='flex text-[10em]' />
                        </PanelButton>
                        <PanelButton url={'users'} text={'Services'} color={'bg-blue-200'}>
                            <FaToolbox className='flex text-[10em]' />
                        </PanelButton>
                    </div>
                </div>
            </section>
        </BaseTemplate>
    );
}

export function PanelButton({text, children, url, color = null}){
    return(
        <a href={`/admin/panel/${url}`} className={`flex flex-col 
            ${url == './' ? 'bg-black text-white' : color || 'bg-white'}
            shadow border rounded p-2 gap-2
            hover:scale-105 hover:shadow-lg 
            transition delay-75 duration-75`}>
            <div className='flex h-full w-full items-center justify-center'>
                {children}
            </div>
            <span className='text-[2em] font-bold text-center w-full'>{text}</span>
        </a>
    );
}

export function PanelActionButton({text, children, action, color = null, changeAction}){
    return(
        <button onClick={() => changeAction(action)} className={`flex flex-col shadow border rounded p-2 gap-2 
            ${color || 'bg-white'}
            hover:scale-105 hover:shadow-lg 
            transition delay-75 duration-75`}>
            <div className='flex h-full w-full items-center justify-center'>
                {children}
            </div>
            <span className='text-[2em] font-bold text-center w-full'>{text}</span>
        </button>
    );
}