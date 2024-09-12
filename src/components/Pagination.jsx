export default function Pagination({ total, paginate, currentPage}){
    const pageNumbers = [];

    for(let i = 1; i <= total; i++ ){
        pageNumbers.push(i);
    }

    return(
        total > 1 ?
        <div className='flex mt-6 content-center justify-center border shadow p-2'>
            <div className='flex flex-row gap-x-1 text-[16px]'>
                {
                    currentPage !== 1 &&
                    <div className='flex'>
                        <button className='w-[45px] h-[45px] p-2 border-2 shadow rounded border-black transition-colors duration-150 
                            hover:bg-black hover:text-white' onClick={() => paginate(currentPage - 1)}>
                            {'<'}
                        </button>
                    </div>
                }
                <ul className='flex flex-row gap-x-1'>
                    {
                        pageNumbers?.map((numberPage) => (
                            <li key={numberPage} className='flex'>
                                <button className={`w-[45px] h-[45px] p-2 border-2 shadow rounded border-black transition-colors duration-150
                                    hover:bg-black hover:text-white 
                                    ${numberPage === currentPage ? 'bg-black text-white' : ''}`} 
                                    onClick={() => {paginate(numberPage)}}>
                                    {numberPage}
                                </button>
                            </li>
                        ))
                    }
                </ul>
                {
                    currentPage !== total &&
                    <div className='flex'>
                        <button className='w-[45px] h-[45px] p-2 border-2 shadow rounded border-black transition-colors duration-150 
                            hover:bg-black hover:text-white' onClick={() => paginate(currentPage + 1)}>
                            {'>'}
                        </button>
                    </div>
                }
            </div>
        </div> : null
    );
}