import { PaginateProductsTemplate } from './Templates';
import { usePagProductsContext } from '../context/PagProductsProvider';

export default function ProductsPage(){
    document.title = "Products";

    const { listOfProducts, totalOfPages, currentPage, limitOfItems, isLoading, getAllProducts } = usePagProductsContext();

    return(
        <PaginateProductsTemplate limitOfPages={limitOfItems} isLoading={isLoading} listOfProducts={listOfProducts}
            pageNumber={currentPage} totalOfPages={totalOfPages} reloadData={getAllProducts} />
    );
}
