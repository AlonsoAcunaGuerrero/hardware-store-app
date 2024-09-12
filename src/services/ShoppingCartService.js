import axios from "axios";
import config from "../config";

export const fetchAllProductsOfCart = async () => {
    try {
        let response = await axios.get(`${config.shoppingCartApiURL}/all/products`);

        return response.data;
    } catch (err) {
        let status = 404;
        let message = '';

        if (err.response) {
            message = err.response.data;
            status = err.response.status;
        } else if (err.request) {
            message = err.request;
        } else {
            message = err.message;
        }

        throw {
            status,
            message
        }
    }
}

export const fetchCleanCart = async () => {
    try {
        let response = await axios.delete(`${config.shoppingCartApiURL}/clean`);

        return {
            code: response.data?.code,
            message: response.data?.message,
        }
    } catch (err) {
        let status = 404;
        let message = '';

        if (err.response) {
            message = err.response.data;
            status = err.response.status;
        } else if (err.request) {
            message = err.request;
        } else {
            message = err.message;
        }

        throw {
            status,
            message
        }
    }
}

export const fetchAddProductToCart = async (productName, quantity) => {
    try{
        let response = await axios.post(`${config.shoppingCartApiURL}/product`, {
            product: productName,
            quantity: quantity,
        });

        return {
            product: response.data?.product,
            quantity: response.data?.quantity
        }
    } catch (err) {
        let status = 404;
        let message = '';

        if (err.response) {
            message = err.response.data;
            status = err.response.status;
        } else if (err.request) {
            message = err.request;
        } else {
            message = err.message;
        }

        throw {
            status,
            message
        }
    }
}

export const fetchRemoveProductOfCart = async (productID) => {
    try{
        let response = await axios.delete(`${config.shoppingCartApiURL}/product/${productID}`);

        return {
            status: response.data?.code,
            message: response.data?.message
        }
    } catch (err) {
        let status = 404;
        let message = '';

        if (err.response) {
            message = err.response.data;
            status = err.response.status;
        } else if (err.request) {
            message = err.request;
        } else {
            message = err.message;
        }

        throw {
            status,
            message
        }
    }
}

export const fetchUpdateProductQuantityOnCart = async (productID, quantity) => {
    try{
        let response = await axios.put(`${config.shoppingCartApiURL}/product/${productID}/${quantity}`)

        return {
            before: response.data?.before,
            now: response.data?.now
        }
    } catch (err) {
        let status = 404;
        let message = '';

        if (err.response) {
            message = err.response.data;
            status = err.response.status;
        } else if (err.request) {
            message = err.request;
        } else {
            message = err.message;
        }

        throw {
            status,
            message
        }
    }
}