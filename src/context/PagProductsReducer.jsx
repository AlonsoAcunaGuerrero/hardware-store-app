export const PAG_PRODUCTS_FILTER = {
    ALL: "ALL",
    BY_TYPE: "BY_TYPE",
    SEARCH: "SEARCH",
}

export default (state, action) =>{
    const {payload, type} = action;

    switch(type){
        case PAG_PRODUCTS_FILTER.ALL:
            return {
                ...state,
                listOfProducts: payload.listItems, 
                totalOfPages: payload.total
            }
        default:
            return state;
    }
}