import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ErrorModal, LoadingModal } from '../components/Modal';
import useUserJWT from '../hooks/UseUserJWT';
import axios from 'axios';
import config from '../config';

export default function LoginPage(){
    
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showingLoading, setShowingLoading] = useState(false);
    const [showingError, setShowingError] = useState(false);
    const {setUserJWT} = useUserJWT();

    const fetchLogin = async ({userEmail, userPassword}) => {
        await axios.post(`${config.userApiURL}/login`, {
            email: userEmail,
            password: userPassword
        })
        .then((res) => {
            setUserJWT(res.data);
            setShowingLoading(false);
            navigate('/');
        })
        .catch((err) => {
            setShowingLoading(false);
            setShowingError(true);
            console.log(err);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowingLoading(true);
        console.log({userEmail : email, userPassword : password});
        fetchLogin({userEmail : email, userPassword : password});
    }
    
    const closeError = () => {
        setShowingError(false);
    }

    return(
        <>
            {
                showingLoading ?
                <LoadingModal message={"Processing your login information, please wait a bit."} /> :
                showingError ?
                <ErrorModal 
                    message={"A error ocurred in the login process, please verify your information."} 
                    close={closeError} /> : null
            }
            <div className='flex min-h-screen items-center justify-center'>
                <div className='flex flex-col bg-gray-200 p-5 rounded shadow-xl w-[500px]'>
                    <h1 className='text-2xl text-center mb-5'>
                        Login
                    </h1>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-y-2'>
                        <div className='grid grid-cols-8 gap-y-8 items-center'>
                            <label htmlFor='email' className='col-span-2'>Email</label>
                            <input type='text' name='email' placeholder='Email' 
                                value={email} onChange={(e) => setEmail(e.target.value)} 
                                className='p-2 col-span-6' />
                            <label htmlFor='user_password' className='col-span-2'>Password</label>
                            <input type='password' name='user_password' placeholder='Password' 
                                value={password} onChange={(e) => setPassword(e.target.value)} 
                                className='p-2 col-span-6' />
                        </div>

                        <button type='submit' className='bg-black mt-5 
                            hover:bg-white hover:text-black hover:shadow 
                            p-2 rounded text-white
                            transition-colors delay-75 duration-75'>Login</button>
                        <p className='text-center'>or</p>
                        <NavLink to='/register' 
                            className='w-full bg-black 
                                hover:bg-white hover:text-black hover:shadow 
                                p-2 rounded text-white text-center
                                transition-colors delay-75 duration-75'>Register</NavLink>
                        <NavLink to='/' className='text-black hover:text-gray-400 pt-2 transition-colors delay-75'>Don't remember your password?</NavLink>
                    </form>
                </div>
            </div>
        </>
    );
}