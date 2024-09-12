export const PRODUCTS_FILTER = {
    NONE: "NONE",
    BY_TYPE: "BY_TYPE",
    SEARCH: "SEARCH",
}

export default (state, action) =>{
    const {payload, type} = action;

    switch(type){
        case PRODUCTS_FILTER.NONE:
            return {
                ...state,
                listOfProducts: payload.listItems, 
                totalPages: payload.pages
            }
        default:
            return state;
    }
}