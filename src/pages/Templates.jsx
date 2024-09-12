import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GridProductsContainer, ListProductsContainer } from '../components/ProductsContainer';
import ControlBar from '../components/ControlBar';
import Pagination from '../components/Pagination';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { LoadingModal } from '../components/Modal';
import ProductTypesBar from '../components/ProductTypesBar';

export function BaseTemplate({children}){
    return(
        <>
            <NavBar />
            <main className='flex text-[12px] md:text-[16px] min-h-screen w-full pt-16'>
                <div className='flex flex-1 p-4'>
                    {children}
                </div>
            </main>
            <Footer />
        </>
    );
}

export function PaginateProductsTemplate({limitOfPages, isLoading, listOfProducts, pageNumber, 
    totalOfPages, reloadData}){
    
    const [searchParams, setSearchParams] = useSearchParams();
    const currentDisplay = searchParams.get('display');
    
    if(!pageNumber){
        searchParams.set('page', String(1));
        searchParams.set('limit', String(12));
        searchParams.set('display', 'G');
        setSearchParams(searchParams);
    }
    else if(!limitOfPages){
        searchParams.set('page', String(numbPage));
        searchParams.set('limit', String(12));
        searchParams.set('display', 'G');
        setSearchParams(searchParams);
    }
    else if(!currentDisplay){
        searchParams.set('page', String(numbPage));
        searchParams.set('limit', String(limitPages));
        searchParams.set('display', 'G');
        setSearchParams(searchParams);
    }
    
    const paginationDisplay = (dis) =>{
        if(dis === 'G' || dis === 'L'){
            searchParams.set('display', dis);
            setSearchParams(searchParams);
        }else{
            searchParams.set('display', 'G');
            setSearchParams(searchParams);
        }
    }

    const paginationAction = (pageNumber) => {
        searchParams.set('page', pageNumber);
        setSearchParams(searchParams);
    }
    const paginationLimit = (limitItems) => {
        searchParams.set('limit', limitItems);
        setSearchParams(searchParams);
    }

    useEffect(() =>{
        reloadData();
        window.scrollTo(0,0);
    }, [searchParams])

    return(
        <BaseTemplate>
            <div className='flex flex-row relative gap-x-4 w-full'>
                <div className='flex flex-col gap-y-2 w-full'>
                {
                    isLoading ? 
                    (<LoadingModal transparent={true} />)
                    : (
                        <>
                            <ControlBar limitItems={limitOfPages} changeLimit={paginationLimit} 
                            changeDisplay={paginationDisplay} display={currentDisplay}/>
                            <div className='flex flex-row'>
                                <ProductTypesBar />

                                <div className='ml-[250px] w-full'>
                                    {
                                        currentDisplay === 'L' ? (<ListProductsContainer products={listOfProducts}/>) 
                                        : (<GridProductsContainer products={listOfProducts}/>)
                                    }
                                </div>
                            </div>
                            <Pagination total={totalOfPages} paginate={paginationAction} currentPage={pageNumber}/>
                        </>
                    )
                }
                </div>
            </div>
        </BaseTemplate>
    );
}