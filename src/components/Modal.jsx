import { BsX, BsXLg, BsCheck, BsFan } from 'react-icons/bs';

export const ACTIONS = {
    NONE : 0,
    ADD : 1,
    EDIT : 2,
    DELETE : 3
}

export const PROCESS_STATUS = {
    NONE: 0,
    FIND: 1,
    LOADING: 2,
    ERROR: 3,
    SUCCESSFUL: 4
}


export function TemplateModal({transparent, close = null, title, children}){
    return(
        <div className={`absolute inset-0 ${transparent ? 'bg-transparent' : 'bg-black bg-opacity-25'} flex justify-center items-center z-20`}>
            <div className='flex flex-col gap-y-3 bg-white rounded border shadow p-2 w-full sm:w-[80%]
                lg:w-1/2 mx-4 md:mx-0'>
                {
                    close != null ?
                    (<button className='bg-black text-white border-4 border-black rounded place-self-end 
                        hover:bg-white hover:text-black transition delay-[5ms]' onClick={() => close()}>
                        <BsX className='text-4xl' />
                    </button>
                    ) : null
                }
                <div className='bg-black rounded w-full p-2'>
                    <h2 className='text-xl text-white text-center w-full'>
                        {title}
                    </h2>
                </div>

                <div className='relative w-full'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function LoadingModal({transparent = false, message}){
    return(
        <TemplateModal transparent={transparent} title={'Loading...'} >
            <div className='static flex flex-col gap-2 p-2'>
                {
                    message !== null && message !== undefined ?
                    (<p className='text-xl text-center mb-2'>
                        {message}
                    </p>) : null
                }
                <div className='flex justify-center items-center w-full h-full'>
                    <BsFan className='text-[200px] text-blue-400 animate-spin' />
                </div>
            </div>
        </TemplateModal>
    );
}

export function ErrorModal({transparent = false, message, close}){
    return(
        <TemplateModal transparent={transparent} title={'Error message'} close={close} >
            <div className='static flex flex-col gap-2 p-2'>
                {
                    message !== null && message !== undefined ?
                    (<p className='text-xl text-center mb-2'>
                        {message}
                    </p>) : null
                }
                <div className='flex justify-center items-center w-full h-full'>
                    <BsXLg className='text-[200px] text-red-500' />
                </div>
            </div>
        </TemplateModal>
    );
}

export function SuccessfulModal({transparent = false, message, close}){
    return(
        <TemplateModal transparent={transparent}  title={'Successful message'} close={close} >
            <div className='static flex flex-col gap-2 p-2'>
                {
                    message == null || message == undefined ?
                    null :
                    (<p className='text-xl text-center mb-2'>
                        {message}
                    </p>)
                }
                <div className='flex justify-center items-center w-full h-full'>
                    <BsCheck  className='text-[200px] text-green-400' />
                </div>
            </div>
        </TemplateModal>
    );
}