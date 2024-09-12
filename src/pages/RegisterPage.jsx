import { useNavigate, NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorModal, LoadingModal } from '../components/Modal';
import { useState } from 'react';
import axios from 'axios';
import config from '../config';

export default function RegisterPage(){

    const navigate = useNavigate();
    const [showingLoading, setShowingLoading] = useState(false);
    const [showingError, setShowingError] = useState(false);
    const {register, handleSubmit, formState: {errors}, watch, reset} = useForm();
    
    const fetchRegister = async (user_data) => {
        await axios.post(`${config.userApiURL}/register`, {
            first_name : user_data.first_name.trim(),
            last_name : user_data.last_name.trim(),
            username : user_data.username.trim(),
            email: user_data.email.trim(),
            birthdate : user_data.birthdate,
            password : user_data.password.trim(),
            confirmpassword : user_data.confirm_password.trim()})
        .then((res) => {
            setShowingLoading(false);
            reset();
            navigate('/login');
        })
        .catch((err) => {
            setShowingLoading(false);
            setShowingError(true);
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                console.log(err.request);
            } else {
                console.log('Error', err.message);
            }
        });
    }

    const onSubmit = handleSubmit((data) => {
        setShowingLoading(true);
        fetchRegister(data);
    })
    
    const closeError = () => {
        setShowingError(false);
    }

    return(
        <>
            {
                showingLoading ?
                <LoadingModal message={"Processing your registration information, please wait a bit."} /> :
                showingError ?
                <ErrorModal message={"A error ocurred in the register process, please verify your information."} 
                    close={closeError} /> : null
            }
            
            <div className='flex min-h-screen items-center justify-center'>
                    <div className='flex flex-col bg-gray-200 p-5 rounded shadow-xl w-full lg:w-1/2 m-2'>
                        <h1 className='text-2xl text-center mb-5'>
                            Register
                        </h1>
                        <form onSubmit={onSubmit} className='flex flex-col gap-y-2'>
                            <div className='grid grid-cols-6 gap-y-2 items-center'>
                            <label className='col-span-2' htmlFor='first_name'>First Name</label>
                                <input type='text' {...register('first_name', {
                                        required: {
                                            value: true,
                                            message: 'The first name is required',
                                        },
                                        minLength: {
                                            value: 5,
                                            message: 'The first name required 5 characters at least',
                                        },
                                        maxLength: {
                                            value: 150,
                                            message: 'The first name can have 150 characters maximum',
                                        },
                                    })} 
                                    className='col-span-4 p-2' placeholder='First Name' />
                                {
                                errors.first_name ? 
                                <div className='col-end-7 col-span-4 mb-3'>
                                    <p>{errors.first_name.message}</p>
                                </div> : null
                                }

                                <label className='col-span-2' htmlFor='last_name'>Last Name</label>
                                <input type='text' {...register('last_name', {
                                        required: {
                                            value: true,
                                            message: 'The last name is required',
                                        },
                                        minLength: {
                                            value: 5,
                                            message: 'The last name required 5 characters at least',
                                        },
                                        maxLength: {
                                            value: 150,
                                            message: 'The last name can have 150 characters maximum',
                                        },
                                    })} 
                                    className='col-span-4 p-2' placeholder='Last Name' />
                                {
                                    errors.last_name ? 
                                    <div className='col-end-7 col-span-4 mb-3'>
                                        <p>{errors.last_name.message}</p>
                                    </div> : null
                                }

                                <label className='col-span-2' htmlFor='username'>Username</label>
                                <input type='text' {...register('username', {
                                        required: {
                                            value: true,
                                            message: 'The username is required',
                                        },
                                        minLength: {
                                            value: 5,
                                            message: 'The username required 5 characters at least',
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: 'The username can have 15 characters maximum',
                                        },
                                    })} 
                                    className='col-span-4 p-2' placeholder='Username' />
                                {
                                    errors.username ? 
                                    <div className='col-end-7 col-span-4 mb-3'>
                                        <p>{errors.username.message}</p>
                                    </div> : null
                                }

                                <label className='col-span-2' htmlFor='email'>E-Mail</label>
                                <input type='email' {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'The email is required',
                                        },
                                        pattern: {
                                            value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                                            message: 'The email is not valid',
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'The email required 8 characters at least',
                                        },
                                        maxLength: {
                                            value: 24,
                                            message: 'The email can have 24 characters maximum',
                                        },
                                        validate: async(value) => {
                                            let isValid = false;

                                            const restEmail = await axios.get(`https://localhost:7042/api/users/verify_email/${value}`);

                                            isValid = restEmail.data;

                                            return isValid || 'The email is taken.';
                                        }
                                    })} 
                                    className='col-span-4 p-2' placeholder='E-Mail' />
                                
                                {
                                    errors.email ? 
                                    <div className='col-end-7 col-span-4 mb-3'>
                                        <p>{errors.email.message}</p>
                                    </div> : null
                                }

                                <label className='col-span-2' htmlFor='birthdate'>Birthdate</label>
                                <input type='date' {...register('birthdate', {
                                        required: {
                                            value: true,
                                            message: 'The birthdate is required',
                                        },
                                        validate: (value) => {
                                            const birthdate = new Date(value);
                                            const currentDate = new Date();
                                            const userAge = currentDate.getFullYear() - birthdate.getFullYear();

                                            return userAge >= 18 || 'The birthdate is not valid, you must be of legal age';
                                        }
                                    })}  
                                    className='col-span-4 p-2' />
                                {
                                    errors.birthdate ? 
                                    <div className='col-end-7 col-span-4 mb-3'>
                                        <p>{errors.birthdate.message}</p>
                                    </div> : null
                                }

                                <label className='col-span-2' htmlFor='password'>Password</label>
                                <input type='password' {...register('password', {
                                        required: {
                                            value: true,
                                            message: 'The Password is required',
                                        },
                                        minLength: {
                                            value: 8,
                                            message: 'The password required 8 characters at least',
                                        },
                                        maxLength:{
                                            value: 16,
                                            message: 'The password can have 16 characters maximum',
                                        }
                                    })}  
                                    className='col-span-4 p-2' placeholder='Password' />
                                {
                                    errors.password ? 
                                    <div className='col-end-7 col-span-4 mb-3'>
                                        <p>{errors.password.message}</p>
                                    </div> : null
                                }
                                
                                <label className='col-span-2' htmlFor='confirm_password'>Confirm Password</label>
                                <input type='password' {...register('confirm_password', {
                                        required: {
                                            value: true,
                                            message: 'Repeat the password',
                                        },
                                        validate: value => value === watch('password') || 'Passwords do not match'
                                    })}   
                                    className='col-span-4 p-2' placeholder='Confirm Password' />
                                {
                                    errors.confirm_password ?
                                    <div className='col-end-7 col-span-4 mb-3'>
                                        <p>{errors.confirm_password.message}</p>
                                    </div> : null
                                }

                                <div className='col-span-6'>
                                    <input type='checkbox' {...register('accept_terms', {
                                        required: {
                                            value: true,
                                            message: 'Please Accept Terms and Requirements',
                                        }
                                    })} />
                                    <label className='pl-2'>Accept Terms and Requirements</label>
                                </div>
                                {
                                    errors.accept_terms ?
                                    <div className='col-span-6 mb-3'>
                                        <p>{errors.accept_terms.message}</p>
                                    </div> : null
                                }
                            </div>
                            
                            
                            <button type='submit' 
                                className='bg-black text-white
                                    hover:bg-white hover:text-black hover:shadow p-2 rounded 
                                    transition delay-75 duration-75'>
                                    Register
                            </button>
                            <NavLink to={'/login'} className='text-black hover:text-gray-400'>
                                You have a account? Click here
                            </NavLink>
                        </form>
                    </div>
            </div>
        </>
    )
}