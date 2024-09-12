import { BaseTemplate } from './Templates';

export default function AboutPage(){
    document.title = 'About';
    
    return(
        <BaseTemplate>
            <div className='p-4 w-full'>
                <h1 className='p-2 text-2xl border-b-2 border-black'>About Us</h1>
                <div className='shadow border mt-2 p-2'>
                    <p className=''>
                        We are a hardware store to please customers with the most new hardware components of the market for gamers and normal customers.
                    </p>
                </div>

                
            </div>
        </BaseTemplate>
    );
}