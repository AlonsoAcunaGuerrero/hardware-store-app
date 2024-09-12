import { createContext, useContext, useReducer } from "react";
import ShoppingCartReducer, { SHOPPING_CART_ACTIONS } from "./ShoppingCartReducer";
import { fetchAllProductsOfCart, fetchCleanCart } from "../services/ShoppingCartService";

const shoppingCartContext = createContext();

export function useShoppingCartContext() {
    return useContext(shoppingCartContext);
}

export function ShoppingCartProvider({ children }){
    const initialState = {
        listOfProducts: []
    }

    const [state, dispatch] = useReducer(ShoppingCartReducer, initialState);

    const getAllProducts = async () => {
        await fetchAllProductsOfCart()
        .then((res) => {
            dispatch({
                type: SHOPPING_CART_ACTIONS.GET_ALL,
                payload: {
                    listItems: res
                }
            })
        })
        .catch((err) => {
            dispatch({
                type: SHOPPING_CART_ACTIONS.CLEAR,
                payload: null
            })
        });
    }

    const clearShoppingCart = async () => {
        await fetchCleanCart()
        .then((res) => {
            dispatch({
                type: SHOPPING_CART_ACTIONS.CLEAR,
                payload: null
            })
        }).catch((err) => {});
    }

    return(
        <shoppingCartContext.Provider value={{
            listOfProducts: state.listOfProducts,
            getAllProducts,
            clearShoppingCart
        }}>
            {children}
        </shoppingCartContext.Provider>
    );
}