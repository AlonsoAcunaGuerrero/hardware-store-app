import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { PaginateProductsTemplate } from './Templates';
import { usePagProductsContext } from '../context/PagProductsProvider';


export default function SearchProductsPage(){
    document.title = 'Search Products'

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const words = searchParams.get('words');

    if(!words){
        navigate('/products?page=1&limit=12&display=G');
    }
    
    const { listOfProducts, totalOfPages, currentPage, limitOfItems, isLoading, getProductsBySearch} = usePagProductsContext();

    useEffect(() =>{
        getProductsBySearch(words);
        window.scrollTo(0,0);
    }, [words])

    return(
        <PaginateProductsTemplate limitOfPages={limitOfItems} isLoading={isLoading} listOfProducts={listOfProducts}
            pageNumber={currentPage} totalOfPages={totalOfPages} reloadData={() => getProductsBySearch(words)} />
    );
}