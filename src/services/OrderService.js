import axios from "axios";
import config from "../config";

export const fetchAllOrders = async () => {
    try {
        let response = await axios.get(config.orderApiURL);

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

export const fetchAdminAllOrders = async () => {
    try {
        let response = await axios.get(`${config.orderApiURL}/admin/list/processing`)

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

export const fetchOrderByID = async (id) => {
    try {
        let response = await axios.get(`${config.orderApiURL}/${id}`);

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

export const fetchAddOrder = async ({addressID, shippingMethodsID}) => {
    try {
        let response = await axios.post(`${config.orderApiURL}/shop/create`, {
            address_id: addressID,
            shipping_method_id: shippingMethodsID
        });

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