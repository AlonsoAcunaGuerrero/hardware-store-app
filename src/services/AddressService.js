import axios from "axios";
import config from "../config";

export const fetchAllCountries = async () => {
    try {
        let response = await axios.get(`${config.apiURL}/api/countries`);

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

export const fetchAllRegionsByCountryID = async (countryID) => {
    try {
        let response = await axios.get(`${config.apiURL}/api/regions/${countryID}`);

        return response.data;
    } catch (err){
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

export const fetchAllCitiesByRegionID = async (regionID) => {
    try {
        let response = await axios.get(`${config.apiURL}/api/cities/${regionID}`);

        return response.data;
    } catch (err){
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

export const fetchAllAddress = async () => {
    try {
        let response = await axios.get(config.addressApiURL);

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

export const fetchAddAddress = async ({unitNumber, streetNumber, addressLine1, addressLine2, postalCode, cityName}) => {
    try {
        let response = await axios.post(config.addressApiURL, 
            {unitNumber, streetNumber, addressLine1, addressLine2, postalCode, cityName});

        return {
            user: response.data?.user,
            address: response.data?.address
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
