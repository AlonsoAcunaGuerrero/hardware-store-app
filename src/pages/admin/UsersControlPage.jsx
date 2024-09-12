import { useEffect, useState } from "react";
import { BaseTemplate } from "../Templates";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { FaUserPlus, FaUserEdit, FaCheckCircle } from "react-icons/fa";
import { FaUserXmark, FaCircleXmark, FaUserCheck } from "react-icons/fa6";
import { BsArrowReturnLeft } from "react-icons/bs";
import { ErrorModal, LoadingModal, SuccessfulModal, TemplateModal, ACTIONS, PROCESS_STATUS } from "../../components/Modal";
import { PanelButton, PanelActionButton } from "./AdminPage";
import { useForm } from "react-hook-form";
import { fetchAdminActivateUser, fetchAdminAddUser, fetchAdminAllUsers, fetchAdminDisableUser, fetchAdminFindUser, fetchAdminValidRoles, fetchVerifyEmail } from "../../services/UserService";

export default function UsersControlPage() {
    document.title = 'Admin - Users Panel'

    const UPDATE_ACTIONS = {
        EDIT: 0,
        DISABLE: 1,
        ACTIVATE: 2
    }

    const [currentAction, setCurrentAction] = useState(ACTIONS.NONE);
    const [currentUpdateAction, setCurrentUpdateAction] = useState(UPDATE_ACTIONS.EDIT);

    return(
        <BaseTemplate>
            {
                currentAction == ACTIONS.ADD ?
                (<AddUserModal title={'Add New User'} close={() => setCurrentAction(ACTIONS.NONE)} />) :
                currentAction == ACTIONS.EDIT ? 
                    currentUpdateAction == UPDATE_ACTIONS.EDIT ?
                    (<EditUserModal title={'Edit User'} close={() => setCurrentAction(ACTIONS.NONE)} />) :
                    currentUpdateAction == UPDATE_ACTIONS.ACTIVATE ?
                    (<ActivateUserModal title={'Activate User'} close={() => setCurrentAction(ACTIONS.NONE)} />) :
                    currentUpdateAction == UPDATE_ACTIONS.DISABLE ?
                    (<DisableUserModal title={'Disable User'} close={() => setCurrentAction(ACTIONS.NONE)} />) : null 
                : null
            }

            <section className='flex flex-1 justify-center'>
                <div className='flex w-[75%]'>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full text-[1.25rem]'>
                        <PanelButton text={'Return'} url={'./'}>
                            <BsArrowReturnLeft className='flex text-[10em]' />
                        </PanelButton>
                        <PanelActionButton text={'Add User'} color={'bg-lime-300'}
                            action={ACTIONS.ADD} changeAction={setCurrentAction}>
                            <FaUserPlus className='flex text-[10em]' />
                        </PanelActionButton>
                        <PanelActionButton text={'Edit User'} color={'bg-yellow-200'}
                            action={ACTIONS.EDIT} changeAction={(action) => {
                                setCurrentUpdateAction(UPDATE_ACTIONS.EDIT);
                                setCurrentAction(action);
                            }}>
                            <FaUserEdit className='flex text-[10em]' />
                        </PanelActionButton>
                        <PanelActionButton text={'Disable User'} color={'bg-red-300'}
                            action={ACTIONS.EDIT} changeAction={(action) => {
                                setCurrentUpdateAction(UPDATE_ACTIONS.DISABLE);
                                setCurrentAction(action);
                            }}>
                            <FaUserXmark className='flex text-[10em]' />
                        </PanelActionButton>
                        <PanelActionButton text={'Activate User'} color={'bg-green-200'}
                            action={ACTIONS.EDIT} changeAction={(action) => {
                                setCurrentUpdateAction(UPDATE_ACTIONS.ACTIVATE);
                                setCurrentAction(action);
                            }}>
                            <FaUserCheck  className='flex text-[10em]' />
                        </PanelActionButton>
                    </div>
                </div>
            </section>
        </BaseTemplate>
    );
}

function AddUserModal({close, title}) {
    const {register, handleSubmit, formState: {errors}, watch, reset} = useForm();
    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState('');
    const [listOfRoles, setListOfRoles] = useState([]);

    const fetchValidRoles = async () =>{
        await fetchAdminValidRoles()
            .then((res) => setListOfRoles(res))
            .catch((err) => {
                setListOfRoles([]);
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
            });
    }

    const fetchAddUser = async (data) => {
        await fetchAdminAddUser(data)
            .then((res) => {
                setCurrentStatus(PROCESS_STATUS.SUCCESSFUL);
                reset();
            })
            .catch((err) => {
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            });
    }

    useEffect(() =>{
        fetchValidRoles();
    }, []);

    const onSubmit = handleSubmit((data) => {
        setCurrentStatus(PROCESS_STATUS.LOADING);
        fetchAddUser(data);
    })

    return(
        <TemplateModal title={title} close={close}>
            {
                currentStatus == PROCESS_STATUS.LOADING ? 
                (<LoadingModal message={'Saving new user'} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal message={errorMsg} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal message={'User created successfully'} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                (<form onSubmit={onSubmit} className='flex flex-col gap-2'>
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='First Name' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Last Name' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Username' />
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

                                    const restEmail = await fetchVerifyEmail(value);

                                    isValid = restEmail;

                                    return isValid || 'The email is taken.';
                                }
                            })} 
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='E-Mail' />
                        
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Password' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Confirm Password' />
                        {
                            errors.confirm_password ?
                            <div className='col-end-7 col-span-4 mb-3'>
                                <p>{errors.confirm_password.message}</p>
                            </div> : null
                        }

                        <label className='col-span-2' htmlFor='role_id'>Role</label>
                        <select className='border-2 focus:border-slate-800 col-span-4 p-2'
                            {...register('role_id', {
                                required: {
                                    value: true,
                                    message: 'Select a correct role',
                                },
                                validate: (value) => {
                                    return value >= 1 || 'The role is not valid';
                                }
                                })}>
                            <option value={0}>Select...</option>
                            {
                                listOfRoles.map((role) => (
                                    <option value={role.id_user_role}>{role.name}</option>
                                ))
                            }
                        </select>

                        {
                            errors.role_id ?
                            <div className='col-end-7 col-span-4 mb-3'>
                                <p>{errors.role_id.message}</p>
                            </div> : null
                        }
                    </div>
                    <button type='submit' className='bg-black 
                            hover:bg-white hover:text-black hover:shadow border-2 border-transparent hover:border-black
                            p-2 mt-4 rounded text-white transition delay-[5ms]'>
                            Add User
                    </button>
                </form>) 
            }
        </TemplateModal>
    )
}

function EditUserModal({close, title}) {
    const [user, setUser] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.FIND);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchSelectUser = async (id) =>{
        await fetchAdminFindUser(id)
            .then((res) => {
                setUser(res);
                setCurrentStatus(PROCESS_STATUS.NONE);
            })
            .catch((err) => {
                setUser(null);
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            })
    }

    const onSubmit = (data) => {
        
    }

    return(
        <TemplateModal title={title} close={close}>
            {
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal transparent={true} message={'User edited successfully.'} 
                    close={() => setCurrentStatus(PROCESS_STATUS.FIND)} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal transparent={true} message={errorMsg} 
                    close={() => setCurrentStatus(PROCESS_STATUS.FIND)} />) :
                currentStatus == PROCESS_STATUS.FIND ?
                (<SearchUsers action={fetchSelectUser} />) : 
                currentStatus == PROCESS_STATUS.NONE ?
                (<UserForm user={user} buttonText={'Save Changes'} actionSubmit={onSubmit} />) : null
            }
        </TemplateModal>
    )
}

function ActivateUserModal({close, title}) {
    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchActivateUser = async (id) => {
        await fetchAdminActivateUser(id)
        .then((res) => {
            setCurrentStatus(PROCESS_STATUS.SUCCESSFUL);
        })
        .catch((err) => {
            let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

            setErrorMsg(newErrorMsg);
            setCurrentStatus(PROCESS_STATUS.ERROR);
        })
    }

    return(
        <TemplateModal title={title} close={close}>
            {
                currentStatus == PROCESS_STATUS.LOADING ?
                (<LoadingModal message={'Activating user...'} />) :
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal message={'User activated successfully.'} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal message={errorMsg} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                (<SearchUsers action={fetchActivateUser}
                    buttonStyle={'flex bg-green-400 text-white justify-between items-center hover:bg-white hover:text-green-400 rounded hover:ring-2 ring-green-400 w-full p-2 transition delay-75'} />)
            }
        </TemplateModal>
    )
}

function DisableUserModal({close, title}) {
    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchDisableUser = async (id) => {
        await fetchAdminDisableUser(id)
        .then((res) => {
            setCurrentStatus(PROCESS_STATUS.SUCCESSFUL);
        })
        .catch((err) => {
            let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

            setErrorMsg(newErrorMsg);
            setCurrentStatus(PROCESS_STATUS.ERROR);
        })
    }

    return(
        <TemplateModal title={title} close={close}>
            {
                currentStatus == PROCESS_STATUS.LOADING ?
                (<LoadingModal message={'Disabling user...'} />) :
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal message={'User disable successfully.'} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal message={errorMsg} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                (<SearchUsers action={fetchDisableUser}
                    buttonStyle={'flex bg-red-400 text-white justify-between items-center hover:bg-white hover:text-red-400 rounded hover:ring-2 ring-red-400 w-full p-2 transition delay-75'} />)
            }
        </TemplateModal>
    )
}

function UserForm({ user = null, buttonText, actionSubmit }) {
    const {register, formState: {errors}, watch, setValue} = useForm();
    const [listOfRoles, setListOfRoles] = useState([]);

    const fetchValidRoles = async () =>{
        await fetchAdminValidRoles()
            .then((res) => setListOfRoles(res?.data))
            .catch((err) => setListOfRoles([]));
    }

    const loadData = async() =>{
        await fetchValidRoles();

        if(user){
            setValue('first_name', user?.first_name);
            setValue('last_name', user?.last_name);
            setValue('username', user?.username);
            setValue('password', user?.password);
            setValue('confirm_password', user?.password);
            setValue('email', user?.email);
            setValue('birthdate', user?.birthdate?.substring(0, 10));
            setValue('role_id', user?.role?.id_user_role);
        }
    }

    const onSubmit = (data) => {

    }
    
    useEffect(() =>{
        loadData();
    }, []);

    return(
        <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                    <div className='grid grid-cols-6 gap-y-2 items-center'>
                        {/*First Name*/}
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='First Name' />
                        {
                            errors.first_name ? 
                            <div className='col-end-7 col-span-4 mb-3'>
                                <p>{errors.first_name.message}</p>
                            </div> : null
                        }
                        
                        {/*Last Name*/}
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Last Name' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Username' />
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

                                    const restEmail = await fetchVerifyEmail(value);

                                    isValid = restEmail;

                                    return isValid || 'The email is taken.';
                                }
                            })} 
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='E-Mail' />
                        
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Password' />
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
                            className='border-2 focus:border-slate-800 col-span-4 p-2' placeholder='Confirm Password' />
                        {
                            errors.confirm_password ?
                            <div className='col-end-7 col-span-4 mb-3'>
                                <p>{errors.confirm_password.message}</p>
                            </div> : null
                        }

                        <label className='col-span-2' htmlFor='role_id'>Role</label>
                        <select className='border-2 focus:border-slate-800 col-span-4 p-2'
                            {...register('role_id', {
                                required: {
                                    value: true,
                                    message: 'Select a correct role',
                                },
                                validate: (value) => {
                                    return value >= 1 || 'The role is not valid';
                                }
                                })}>
                            <option value={0}>Select...</option>
                            {
                                listOfRoles.map((role) => (
                                    <option value={role.id_user_role}>{role.name}</option>
                                ))
                            }
                        </select>

                        {
                            errors.role_id ?
                            <div className='col-end-7 col-span-4 mb-3'>
                                <p>{errors.role_id.message}</p>
                            </div> : null
                        }
                    </div>
                    <button type='submit' className='bg-black 
                            hover:bg-white hover:text-black hover:shadow border-2 border-transparent hover:border-black
                            p-2 mt-4 rounded text-white transition delay-[5ms]'>
                            {buttonText}
                    </button>
                </form>
    );
}

function SearchUsers({ action, buttonStyle }) {    
    const [searchText, setSearchText] = useState('');
    const [listOfUsers, setListOfUsers] = useState([]);

    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchUsers = async () => {
        await fetchAdminAllUsers()
            .then((res) => {
                setListOfUsers(res);
                setCurrentStatus(PROCESS_STATUS.NONE)
            })
            .catch((err) => {
                setListOfUsers([]);
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            })
    }

    const refreshData = () => {
        if(searchText.length > 0){
            //setCurrentStatus(PROCESS_STATUS.LOADING);
        }else{
            setCurrentStatus(PROCESS_STATUS.LOADING);
            fetchUsers();
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        refreshData();
    }

    useEffect(() =>{
        refreshData();
    }, [])

    return(
        <form onSubmit={onSubmit} className='flex flex-col gap-2'>
            <div className='flex flex-col gap-4'>
                {/*Search Bar*/}
                <div className='flex flex-row items-center gap-2 w-full'>
                </div>

                {/*List Of Users*/}
                <div className='relative flex overflow-scroll h-[450px] w-full p-1'>
                    {
                        currentStatus == PROCESS_STATUS.LOADING ?
                        (<LoadingModal message={'Loading users...'} />) :
                        currentStatus == PROCESS_STATUS.ERROR ?
                        (<ErrorModal message={errorMsg} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                        (<ul className='flex flex-col h-full w-full p-1 gap-2'>
                            {
                                listOfUsers?.map((user) =>(
                                    <UserCard id={user?.id_user} first_name={user?.first_name}
                                        last_name={user?.last_name} username={user?.username}
                                        email={user?.email} birthdate={user?.birthdate} 
                                        is_active={user?.is_active} role={user?.role?.name}>
                                            <button className={buttonStyle || 
                                                'flex bg-black text-white justify-between items-center hover:bg-white hover:text-black rounded hover:ring-2 ring-black w-full p-2 transition delay-75'}
                                                onClick={async () =>{
                                                    //setCurrentStatus(PROCESS_STATUS.LOADING);
                                                    await action(user?.id_user);
                                                    refreshData();
                                                }}>
                                                <BiSolidLeftArrow />
                                                Select
                                                <BiSolidRightArrow />
                                            </button>
                                    </UserCard>
                                ))
                            }
                        </ul>)
                    }
                </div>
            </div>
        </form>
    )
}

function UserCard({id, first_name, last_name, username, email, birthdate, is_active, role, children}) {
    return(
        <li key={id} className='flex flex-col rounded border shadow p-2 gap-2 text-[1rem]'>
            {/*User Data*/}
            <div className="flex flex-row gap-2">
                <div className='flex flex-col gap-1 w-1/3'>
                    <div className='flex flex-col gap-1'>
                        <span className='font-bold'>Full Name:</span>
                        <span>{first_name + " " + last_name}</span>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <span className='font-bold'>Birthdate:</span>
                        <span>{birthdate}</span>
                    </div>
                </div>

                <div className='flex flex-col gap-1 w-1/3'>
                    <div className='flex flex-col gap-1'>
                        <span className='font-bold'>Email:</span>
                        <span className='overflow-clip'>{email}</span>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <span className='font-bold'>Username:</span>
                        <span>{username}</span>
                    </div>
                </div>

                <div className='flex flex-col gap-1 w-1/3'>
                    <div className='flex flex-col gap-1'>
                        <span className='font-bold'>Role:</span>
                        <span>{role}</span>
                    </div>
                </div>
            </div>

            <div className='flex flex-row border shadow p-2 gap-2'>
                <div className='flex flex-row gap-1 items-center w-1/2'>
                    <span className='font-bold'>Is Active:</span>
                    <span className='text-[1.5em]'>
                        {
                            is_active ? 
                            (<FaCheckCircle/>) :
                            (<FaCircleXmark/>)
                        }
                    </span>
                </div>

                <div className='flex flex-row gap-1 items-center w-1/2'>
                    {children}
                </div>
            </div>
        </li>
    )
}