import axios from "axios";
import config from "../config";

export const fetchValidUserAccess = async () => {
    try {
        await axios.get(`${config.userApiURL}/admin/verify`);

        return true;
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

export const fetchVerifyEmail = async (email) => {
    try {
        await axios.get(`${config.userApiURL}/verify_email/${email}`);
        
        return true;
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

        return false;
    }
}

export const fetchUserData = async () => {
    try {
        let response = await axios.get(`${config.userApiURL}/info`);
        
        return {
            firstName: response.data?.firstName,
            lastName: response.data?.lastName,
            username: response.data?.username,
            email: response.data?.email,
            password: response.data?.password,
            birthdate: response.data?.birthdate,
            isActive: response.data?.isActive,
            role: response.data?.role
        };
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

export const fetchAdminAllUsers = async () => {
    try {
        let response = await axios.get(`${config.userApiURL}/admin/list`);
        
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

export const fetchAdminValidRoles = async () => {
    try {
        let response = await axios.get(`${config.userApiURL}/admin/valid_roles`);
        
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

export const fetchAdminAddUser = async ({firstName, lastName, username, email, birthdate, password, role}) => {
    try {
        let response = await axios.post(`${config.userApiURL}/admin/add`, 
            {firstName, lastName, username, email, birthdate, password, role}
        );
        
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

export const fetchAdminFindUser = async (id) => {
    try {
        let response = await axios.get(`${config.userApiURL}/admin/find/${id}`);
        
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

export const fetchAdminActivateUser = async (id) => {
    try {
        let response = await axios.put(`${config.userApiURL}/admin/activate/${id}`)
        
        return {
            oldData: response.data?.oldUser,
            newData: response.data?.newUser
        };
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

export const fetchAdminDisableUser = async (id) => {
    try {
        let response = await axios.put(`${config.userApiURL}/admin/disable/${id}`)
        
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

// export const fetchAdminUpdateUser = async () => {

// }