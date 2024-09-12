import axios from "axios";
import config from "../config";

export const fetchAllProductTypes = async () => {
    try {
        let response = await axios.get(`${config.productTypeApiURL}`);

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