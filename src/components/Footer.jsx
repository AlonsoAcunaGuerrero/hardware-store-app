import { BsTwitter, BsMeta, BsWhatsapp, BsDiscord } from 'react-icons/bs'
import { Link } from 'react-router-dom';

export default function Footer(){
    return(
        <footer className='flex flex-1 text-[12px] md:text-[16px] bg-slate-800 w-full justify-center'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 px-2 py-6'>
                {/*Store Information*/}
                <div className='flex flex-col gap-2'>
                    <h2 className='text-white text-center text-[1.75em] pb-4 font-bold'>Store Information</h2>
                    <ul className='flex md:flex-col flex-row md:gap-y-4 gap-x-8 text-white items-center justify-center'>
                        <li className=''>
                            <Link to={'/services'} className='text-[1.5em] hover:border-b-2'>
                                Services
                            </Link>
                        </li>
                        <li className=''>
                            <Link to={'/about'} className='text-[1.5em] hover:border-b-2'>
                                About
                            </Link>
                        </li>
                        <li className=''>
                            <Link to={'/terms'} className='text-[1.5em] hover:border-b-2'>
                                Terms
                            </Link>
                        </li>
                    </ul>
                </div>

                {/*Contacts*/}
                <div className='flex flex-col gap-2'>
                    <h2 className='text-white text-center text-[1.75em] font-bold'>Contacts</h2>
                    <ul className='flex flex-wrap justify-center text-2xl'>
                        <li>
                            <a href='https://twitter.com' 
                                className='flex p-4 m-4 text-[1em] sm:text-[1.5em] rounded-full bg-white transition 
                                duration-100 hover:scale-125'>
                                <BsTwitter className='text-black' />
                            </a>
                        </li>
                        <li>
                            <a href='https://www.facebook.com/' 
                                className='flex p-4 m-4 text-[1em] sm:text-[1.5em] rounded-full bg-white transition 
                                duration-100 hover:scale-125'>
                                <BsMeta className='text-black' />
                            </a>
                        </li>
                        <li>
                            <a href='https://www.whatsapp.com/?lang=es_LA' 
                                className='flex p-4 m-4 text-[1em] sm:text-[1.5em] rounded-full bg-white transition 
                                duration-100 hover:scale-125'>
                                <BsWhatsapp className='text-black' />
                            </a>
                        </li>
                        <li>
                            <a href='https://discord.com/' 
                                className='flex p-4 m-4 text-[1em] sm:text-[1.5em] rounded-full bg-white transition 
                                duration-100 hover:scale-125'>
                                <BsDiscord className='text-black' />
                            </a>
                        </li>
                    </ul>
                </div>

                {/*Products Information*/}
                <div className='flex flex-col gap-2'>
                    <h2 className='text-white text-center text-[1.75em] pb-4 font-bold'>Products Information</h2>
                    <ul className='flex md:flex-col flex-row md:gap-y-4 gap-x-8 text-white items-center justify-center'>
                        <li className='text-[1.5em]'>
                            Products
                        </li>
                        <li className='text-[1.5em]'>
                            Certificates
                        </li>
                        <li className='text-[1.5em]'>
                            Guaranties
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}