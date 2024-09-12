import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllProducts, fetchAllProductsOfType, fetchAllProductsBySearch } from "../services/ProductService";
import PagProductsReducer, { PAG_PRODUCTS_FILTER } from "./PagProductsReducer";

const pagProductsContext = createContext();

export function usePagProductsContext(){
    return useContext(pagProductsContext);
}

export function PagProductsProvider({children}){
    const initialState = { 
        listOfProducts: [], 
        totalOfPages: 1,
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const numbPage = parseInt(searchParams.get('page'));
    const limitOfItems = parseInt(searchParams.get('limit'));

    const [isLoading, setIsLoading] = useState(false);
    const [state, dispatch] = useReducer(PagProductsReducer, initialState);

    const getAllProducts = async () =>{
        setIsLoading(true);

        await fetchAllProducts(numbPage, limitOfItems)
        .then((res) => {
            dispatch({
                type: PAG_PRODUCTS_FILTER.ALL,
                payload: {
                    listItems: res.listOfProducts, 
                    total: res.totalOfPages
                }
            })
        })
        .catch((err) => {
            dispatch({
                type: PAG_PRODUCTS_FILTER.ALL,
                payload: {
                    listItems: [], 
                    total: 1
                }
            })
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    const getProductsByType = async (type) => {
        setIsLoading(true);
        
        await fetchAllProductsOfType(type, numbPage, limitOfItems)
        .then((res) => {
            dispatch({
                type: PAG_PRODUCTS_FILTER.ALL,
                payload: {
                    listItems: res.listOfProducts, 
                    total: res.totalOfPages
                }
            })
        })
        .catch((err) => {
            dispatch({
                type: PAG_PRODUCTS_FILTER.ALL,
                payload: {
                    listItems: [], 
                    total: 1
                }
            })
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    const getProductsBySearch = async (search) =>{
        setIsLoading(true);

        await fetchAllProductsBySearch(search, numbPage, limitOfItems)
        .then((res) => {
            dispatch({
                type: PAG_PRODUCTS_FILTER.ALL,
                payload: {
                    listItems: res.listOfProducts, 
                    total: res.totalOfPages
                }
            })
        })
        .catch((err) => {
            dispatch({
                type: PAG_PRODUCTS_FILTER.ALL,
                payload: {
                    listItems: [], 
                    total: 1
                }
            })
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() =>{

    }, [searchParams])

    return(
        <pagProductsContext.Provider value={{
            listOfProducts: state.listOfProducts,
            totalOfPages: state.totalOfPages,
            currentPage: numbPage,
            limitOfItems: limitOfItems,
            isLoading,
            getAllProducts,
            getProductsByType,
            getProductsBySearch
        }}>
            {children}
        </pagProductsContext.Provider>
    )
}