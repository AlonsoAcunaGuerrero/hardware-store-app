import { Navigate, Outlet, useNavigate} from "react-router-dom";
import { useEffect } from "react";
import { fetchValidUserAccess } from "../services/UserService";

export default function ProtectedRoute({isAllowed, redirectTo='/'}){

    if(!isAllowed){
        return <Navigate to={redirectTo}/>
    }

    return <Outlet />;
}

export function HighAccessProtectedRoute(){
    const navigate = useNavigate();
    
    useEffect(() =>{
        const fetchValidAccess = async () =>{
            await fetchValidUserAccess()
            .then((res) => {}).catch((err) => {navigate('/')})
        }

        fetchValidAccess();
    }, []);

    return <Outlet />;
}