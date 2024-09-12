export const SHOPPING_CART_ACTIONS = {
    GET_ALL: "ALL",
    CLEAR: "CLEAR",
}

export default (state, action) => {
    const {payload, type} = action;

    switch(type){
        case SHOPPING_CART_ACTIONS.GET_ALL:
            return {
                ...state,
                listOfProducts: payload.listItems
            }
        case SHOPPING_CART_ACTIONS.CLEAR:
            return{
                ...state,
                listOfProducts: []
            }
        default:
            return state;
    }
}