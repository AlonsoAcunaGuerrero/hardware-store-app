import axios from "axios";
import config from "../config";

export const fetchAllProducts = async (numbPage = -1, limitOfItems = 10) => {
    try {
        const response = await axios.get(`${config.productApiURL}`, {
            params: {
                page: numbPage,
                pageSize: limitOfItems
            }
        });

        return { 
            listOfProducts: response.data?.listItems, 
            totalOfPages: response.data?.total
        };
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

export const fetchAllProductsOfType = async (type, numbPage = -1, limitOfItems = 10) => {
    try {
        const response = await axios.get(`${config.productApiURL}/type/${type}`, {
            params: {
                page: numbPage,
                pageSize: limitOfItems
            }
        });

        return { 
            listOfProducts: response.data?.listItems, 
            totalOfPages: response.data?.total
        };
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

export const fetchAllProductsBySearch = async (search, numbPage = -1, limitOfItems = 10) => {
    try{
        const response = await axios.get(`${config.productApiURL}/search/${search}`, {
            params: {
                page: numbPage,
                pageSize: limitOfItems
            }
        });

        return { 
            listOfProducts: response.data?.listItems, 
            totalOfPages: response.data?.total
        };
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

export const fetchProductByName = async (name) => {
    try {
        let response = await axios.get(`${config.productApiURL}/find/${name}`);

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

export const fetchProductByID = async (id) => {
    try {
        let response = await axios.get(`${config.productApiURL}/${id}`);

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

export const fetchAdminAddProduct = async ({name, description, price, stock, image, type}) => {
    try {
        const response = await axios.post(`${config.productApiURL}/admin/add`, 
            {name, description, price, stock, image, type}, 
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        );

        return {
            id: response.data?.id,
            name: response.data?.name,
            description: response.data?.description,
            price: response.data?.price,
            stock: response.data?.stock,
            image: response.data?.image,
            type: {
                id: response.data?.type?.id,
                name: response.data?.type?.name
            }
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

export const fetchAdminUpdateProduct = async ({id, name, description, price, stock, image, type}) => {
    try {
        let response = await axios.put(`${config.productApiURL}/admin/update/${id}`, 
            {name, description, price, stock, image, type}, 
            {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            }
        );

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

export const fetchAdminRemoveProductByID = async (id) => {
    try {
        let response = await axios.delete(`${config.productApiURL}/admin/delete/${id}`);

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