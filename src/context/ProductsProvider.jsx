import { createContext, useContext, useEffect, useReducer } from "react";
import ProductsReducer, { PRODUCTS_FILTER } from "./ProductsReducer";
import { useSearchParams } from "react-router-dom";
import { fetchAllProducts } from "../services/ProductService";

const productsContext = createContext();

export function useProductsContext(){
    return useContext(productsContext);
}

export function ProductsProvider({children}){
    const initialState = { 
        listOfProducts: [], 
        totalPages: 1, 
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const numbPage = parseInt(searchParams.get('page'));
    const limitItems = parseInt(searchParams.get('limit'));

    const [state, dispatch] = useReducer(ProductsReducer, initialState);

    const getAllProducts = async () =>{
        await fetchAllProducts(numbPage, limitItems)
        .then((res) => {
            dispatch({
                type: PRODUCTS_FILTER.NONE,
                payload: {
                    listItems: res.listOfProducts, 
                    pages: res.totalOfPages
                }
            })
        })
        .catch((err) => {
            dispatch({
                type: PRODUCTS_FILTER.NONE,
                payload: {
                    listItems: [], 
                    pages: 1
                }
            })
        });
    }
    
    return(
        <productsContext.Provider value={{
            listOfProducts: state.listOfProducts,
            totalPages: state.totalPages,
            getAllProducts
        }}>
            {children}
        </productsContext.Provider>
    );
}