import { BsFillGrid3X3GapFill, BsList } from "react-icons/bs"; 

export default function ControlBar({limitItems, changeLimit, changeDisplay, display}){

    const listLimits = [12, 16, 20];
    
    const closeLimit = (value, list) =>{
        let closeValue = list[0];
        let closeDifference = Math.abs(value - list[0]);

        for(let i = 1; i < list.length; i++){
            const currentDifference = Math.abs(value - list[i]);

            if(currentDifference < closeDifference){
                closeValue = list[i];
                closeDifference = currentDifference;
            }
        }

        return closeValue;
    }

    return(
        <div className='flex flex-row w-full border shadow p-2'>
            <div className='flex w-full justify-between items-center'>
                <div className='flex flex-row gap-x-2 ustify-center items-center'>
                    <span className='text-center justify-center content-center' >
                        {"Display:"}
                    </span>
                    <button className={display === 'G' ? 'bg-slate-500 p-2 rounded' 
                        : 'bg-slate-300 p-2 rounded hover:bg-slate-500 transition-colors duration-100'}
                        onClick={() => {if(display !== 'G'){changeDisplay('G')}}}>
                        <BsFillGrid3X3GapFill className='text-xl' />
                    </button>
                    <button className={display === 'L' ? 'bg-slate-500 p-2 rounded' 
                        : 'bg-slate-300 p-2 rounded hover:bg-slate-500 transition-colors duration-100'}
                        onClick={() => {if(display !== 'L'){changeDisplay('L')}}}>
                        <BsList className='text-xl' />
                    </button>
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <span className='mr-1'>{'Limit Items:'}</span>
                    <select name='limitItems' value={closeLimit(limitItems, listLimits)} 
                        onChange={(e) => changeLimit(closeLimit(parseInt(e.target.value), listLimits))} 
                        className='border py-1 px-2'>
                        {
                            listLimits.map((lp, index) => (
                                <option key={index} value={lp}>{lp}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </div>
    );
}