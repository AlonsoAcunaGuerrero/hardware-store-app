import { useParams, useSearchParams } from 'react-router-dom';
import { PaginateProductsTemplate } from "./Templates";
import { useEffect } from 'react';
import { usePagProductsContext } from '../context/PagProductsProvider';

export default function ProductsByTypePage() {
    const {type} = useParams();

    document.title = type ? `Products - ${type}` : 'Products'

    const { listOfProducts, totalOfPages, currentPage, limitOfItems, isLoading, getProductsByType} = usePagProductsContext();

    useEffect(() =>{
        getProductsByType(type);
    }, [type])

    return(
        <PaginateProductsTemplate limitOfPages={limitOfItems} isLoading={isLoading} listOfProducts={listOfProducts}
            pageNumber={currentPage} totalOfPages={totalOfPages} reloadData={() => getProductsByType(type)} />
    );
}