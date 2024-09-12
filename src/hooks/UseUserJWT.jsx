import { useState } from "react";
import config from "../config";

export default function useUserJWT(){

    const storage = window.localStorage.getItem(config.localStorageKey);
    const valueStorage = storage ? JSON.parse(storage) : null;

    const [storedUsername, setStoredUsername] = useState(() =>{
        try{
            if(valueStorage){
                return valueStorage.username ?? '';
            }
            else{
                return '';
            }
        }catch(err){
            return '';
        }
    });

    const [accessToken, setAccessToken] = useState(() => {
        try{
            if(valueStorage){valueStorage.accessToken ?? ''
                return valueStorage.accessToken ?? '';
            }
            else{
                return '';
            }
        }catch(err){
            return '';
        }
    });

    const [userRole, setUserRole] = useState(() => {
        try{
            if(valueStorage){
                return valueStorage.role ?? '';
            }
            else{
                return '';
            }
        }catch(err){
            return '';
        }
    });

    const [refreshToken, setRefreshToken] = useState(() =>{
        try{
            if(valueStorage){
                return valueStorage.refreshToken ?? '';
            }
            else{
                return '';
            }
        }catch(err){
            return '';
        }
    });

    const [isHighAccess, setIsHighAccess] = useState(() =>{
        try{
            if(valueStorage){
                if(valueStorage.role){
                    if(valueStorage.role === 'Admin' || valueStorage.role === 'DepartmentHead' || valueStorage.role === 'Manager'){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }
            else{
                return false;
            }
        }catch(err){
            return false;
        }
    });

    const setUserJWT = (data) => {
        try{
            window.localStorage.removeItem(config.localStorageKey);
            window.localStorage.setItem(config.localStorageKey, JSON.stringify(data));
            axios.defaults.headers.common["Authorization"] = `Bearer ${data?.AccessToken}`;
        }catch(e){
            console.log("Error saving token in localstorage.");
        }
    }

    const updateAccessToken = (newAccessToken) => {
        try{
            if (valueStorage){
                const newValueStorage = {
                    accessToken: newAccessToken,
                    refreshToken: valueStorage?.refreshToken,
                    username: valueStorage?.username,
                    role: valueStorage?.role
                };

                axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                window.localStorage.removeItem(config.localStorageKey);
                window.localStorage.setItem(config.localStorageKey, JSON.stringify(newValueStorage));
            }
        }catch(e){
            console.log(e);
            console.log("Error updating in access token.");
        }
    }

    const erraseUserJWT = () => {
        window.localStorage.removeItem(config.localStorageKey);
        delete axios.defaults.headers.common["Authorization"];
    }

    const [isLoged, setIsLoged] = useState((storedUsername !== '' && accessToken !== '' && refreshToken !== ''));

    return {storedUsername, userRole, accessToken, refreshToken, isLoged, isHighAccess, setUserJWT, updateAccessToken, erraseUserJWT};
}