import PCMaintenance from '../img/Computer-maintenance-1024x683.jpg';
import Warranty from '../img/warranty-logo.png';
import { TiArrowSortedDown } from "react-icons/ti";
import { BaseTemplate } from './Templates';
import { useState } from 'react';

export default function ServicesPage(){
    document.title = 'Services';

    return(
        <BaseTemplate>
            <div className='flex flex-col'>
                <h2 className='p-2 text-xl border-b-2 border-black'>Services</h2>
                <div className='grid grid-cols-3 gap-4 pt-2'>
                    <ServicesPanel name={'PC Maintenance'} img={PCMaintenance}/>
                    <ServicesPanel name={'Warranty'} img={Warranty}/>
                </div>
            </div>
        </BaseTemplate>
    );
}

function ServicesPanel({name, desc, img}){
    const [isDescVisible, setIsDescVisible] = useState(false);

    return(
        <div className='flex flex-col bg-gray-200 rounded shadow p-2 gap-y-2'>
            <h3 className='text-center text-xl font-bold p-1'>{name}</h3>
            <div className='flex h-full w-full justify-center items-center'>
                <img src={img} alt='The Image of PC maintenance.' className='object-contain rounded' />
            </div>

            <p className={`${isDescVisible ? 'flex' : 'hidden'} px-2`}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta eveniet odio adipisci similique autem molestias dolorum esse quidem quia neque voluptate numquam pariatur, explicabo, aut et suscipit cupiditate aspernatur vero?</p>

            <button className='flex bg-gray-800 rounded p-2 mt-auto text-white justify-center'
                onClick={() => setIsDescVisible(!isDescVisible)} >
                <TiArrowSortedDown className={`${isDescVisible ? 'rotate-180' : 'rotate-0'} text-[35px]`} />
            </button>
        </div>
    );
}