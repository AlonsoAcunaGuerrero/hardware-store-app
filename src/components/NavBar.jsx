import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BsList, BsPersonFill, BsCaretUpFill, BsFillCartFill } from "react-icons/bs";
import { ShoppingCartProductCard } from './ProductCard';
import useUserJWT from '../hooks/UseUserJWT';
import config from '../config';
import axios from 'axios';
import { ShoppingCartProvider, useShoppingCartContext } from '../context/ShoppingCartProvider';
import { fetchAllProductTypes } from '../services/ProductTypeService';

export default function NavBar(){

    const navigate = useNavigate();
    const {storedUsername, userRole, isLoged, erraseUserJWT} = useUserJWT();
    
    const [listOfTypes, setListOfTypes] = useState([]);

    const [visibleMenu, setVisibleMenu] = useState(false);
    const [mouseOnUserButton, setMouseOnUserButton] = useState(false);
    const [mouseOnProductsButton, setMouseOnProductsButton] = useState(false);

    const [searchWords, setSearchWords] = useState('');

    const fetchTypes = async () => {
        await fetchAllProductTypes()
        .then((res) => setListOfTypes(res))
        .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(searchWords){
            navigate(`/products/search?words=${searchWords}&page=1&limit=12&display=G`);
        }
    }

    return(
        <nav className='flex text-[12px] md:text-[16px] justify-between items-center shadow w-full fixed bg-white px-4 py-2 z-10'>
            {/*Logo And Menu Button*/}            
            <div className='flex items-center'>
                <button className='flex lg:hidden bg-slate-500 rounded p-2 mr-4'
                    onClick={() => setVisibleMenu(!visibleMenu)}>
                    <BsList className='text-slate-300 text-3xl'/>
                </button>
                Logo
                
                {
                    visibleMenu ?
                    (<div className='flex lg:hidden fixed top-16 left-0 min-w-full min-h-screen overflow-scroll'>
                        <div className='bg-slate-300 bg-opacity-95 w-full'>
                            <div className='flex flex-col w-full text-[1.75rem] text-center text-white'>
                                <div className='flex flex-col w-full'>
                                    <div className='flex flex-row w-full'>
                                        <NavLink to='/products?page=1&limit=12&display=G' 
                                            className={'bg-black text-white px-4 w-full'}>
                                            <span className='pr-4 py-2 w-full'>Products</span>
                                        </NavLink>
                                        <button className='flex bg-black p-4'
                                            onClick={() => setMouseOnProductsButton(!mouseOnProductsButton)}>
                                            <BsCaretUpFill className={`flex transition-transform h-full w-full ${mouseOnProductsButton ? 'transform rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                    <ul className={`${mouseOnProductsButton ? 'flex' : 'hidden'} flex-col w-full text-[2rem]`}>
                                        {
                                            listOfTypes?.map((type_product, index) => (
                                            <li className='w-full' key={index}>
                                                <DropdownProductItem typeName={type_product.name} />
                                            </li>))
                                        }
                                    </ul>
                                </div>
                                <NavLink to='/services' 
                                    className={'bg-black text-white px-4'}>
                                    <span className='pr-4 py-2 w-full'>Services</span>
                                </NavLink>
                                <NavLink to='/about' 
                                    className={'bg-black text-white px-4'}>
                                    <span className='pr-4 py-2 w-full'>About Us</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>) : null
                }
                
            </div>

            {/*Searchbar And Navigation Buttons*/}
            <div className='lg:flex hidden'>
                <form onSubmit={handleSubmit} className='flex flex-row'>
                    <input name='inputSearch' className='bg-slate-200 py-2 px-4 rounded-l-full' type='text'
                        value={searchWords} onChange={(e) => setSearchWords(e.target.value)} />
                    <button type='submit' className='bg-slate-200 py-2 px-4 border-l-2 border-slate-400 hover:shadow-inner hover:shadow-slate-400 rounded-r-full'>Search</button>
                </form>
                <ul className='flex flex-row gap-x-3 items-center ml-4'>
                    <li className='flex relative' 
                        onMouseEnter={() => setMouseOnProductsButton(true)} 
                        onMouseLeave={() => setMouseOnProductsButton(false)}>
                        <NavLink to='/products?page=1&limit=12&display=G' className={({isActive}) => isActive || mouseOnProductsButton ? 
                            'inline-flex bg-black text-white rounded-full px-4' 
                            : 'inline-flex hover:bg-black hover:text-white hover:rounded-full items-center transition-all duration-150 px-4'}>
                            <span className='pr-4 py-2 w-full'>Products</span>
                            <BsCaretUpFill className={`flex transition-transform h-full w-full ${mouseOnProductsButton ? 'transform rotate-180' : ''}`} />
                        </NavLink>

                        <div className={`absolute top-8 right-0 left-0
                            ${mouseOnProductsButton ? '' : 'hidden'}`}>
                            <div className='absolute'>
                                <ul className='block mt-4 text-center p-2 bg-white shadow border rounded'>
                                    {
                                        listOfTypes?.map((typeProduct, index) => (
                                            <li className='w-full py-1' key={index}>
                                                <DropdownProductItem typeName={typeProduct.name} />
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li className='flex'>
                        <NavLink to='/services' className={
                            ({isActive}) => isActive ? 
                        'inline-flex bg-black text-white rounded-full px-4' 
                        : 'inline-flex hover:bg-black hover:text-white hover:rounded-full transition-all duration-150 px-4'}>
                            <span className='py-2 w-full'>Services</span>
                        </NavLink>
                    </li>
                    <li className='flex'>
                        <NavLink to='/about' className={({isActive}) => isActive ? 
                        'inline-flex bg-black text-white rounded-full px-4' 
                        : 'inline-flex hover:bg-black hover:text-white hover:rounded-full transition-all duration-150 px-4'}>
                            <span className='py-2 w-full'>About Us</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
            
            {/*Shopping Cart And Login*/}
            <div className='flex flex-row gap-x-2'>
                {
                    userRole == 'User' ?
                    <ShoppingCartProvider>
                        <ShoppingCartPanel />
                    </ShoppingCartProvider> : null
                }
                
                {/*User Button*/}
                <div className='flex relative'>
                    <button className='flex flex-row shadow hover:shadow-inner border items-center 
                        rounded-full p-2 gap-2' 
                        onClick={() => {setMouseOnUserButton(!mouseOnUserButton)}}>
                        <div className='bg-black p-2 rounded-full'>
                            <BsPersonFill className='text-white' />
                        </div>

                        {
                            storedUsername ? (
                                <div className='flex text-[1.25em] sm:text-[1em] mx-2'>
                                    {storedUsername}
                                </div>
                            ) : null
                        }
                        <BsCaretUpFill className={`flex transition-transform h-full w-full ${mouseOnUserButton ? 'transform rotate-180' : ''}`} />
                    </button>

                    {
                        !isLoged ? (
                            <div className={`absolute right-0 top-14 bg-white shadow rounded border w-[125px] 
                                ${mouseOnUserButton ? '' : 'hidden'}`}>
                                <ul className='flex flex-col text-[1.25em] sm:text-[1em] text-center p-2'>
                                    <li className='w-full'>
                                        <NavLink to={'/login'} className='block text-black hover:bg-black 
                                            hover:text-white rounded p-2 w-full'>
                                            Login
                                        </NavLink>
                                    </li>
                                    <li className="w-full">
                                        <NavLink to={'/register'} className='block text-black hover:bg-black 
                                            hover:text-white rounded p-2 w-full'>
                                            Register
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className={`absolute left-0 right-0 top-14 text-[1.25em] sm:text-[1em] 
                                bg-white shadow rounded border w-full 
                                ${mouseOnUserButton ? '' : 'hidden'}`}>
                                <ul className='flex flex-col gap-y-2 text-center p-2'>
                                    <li className='flex w-full'>
                                        <NavLink to={'/user/profile'} className='w-full text-black 
                                            hover:bg-black hover:text-white rounded p-2'>
                                            Profile
                                        </NavLink>
                                    </li>
                                    <li className='flex w-full'>
                                        <NavLink to={'/user/shopping_cart'} className='w-full text-black 
                                            hover:bg-black hover:text-white rounded p-2'>
                                            Shopping Cart
                                        </NavLink>
                                    </li>
                                    <li className='flex w-full'>
                                        <button className='bg-red-600 text-white hover:bg-red-400 rounded w-full p-2'
                                            onClick={() => {erraseUserJWT(); navigate('/login')}}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    );
}

function DropdownProductItem({typeName}){
    return(
        <NavLink to={`/products/type/${typeName}?page=1&limit=12&display=G`} 
            className={({isActive}) => isActive ? 
            'block text-[0.75em] sm:text-[1em] px-4 py-2 bg-black text-white rounded whitespace-nowrap' 
            : 
            'block text-[0.75em] sm:text-[1em] px-4 py-2 bg-white text-black hover:bg-black hover:text-white rounded whitespace-nowrap'}>
            {typeName}
        </NavLink>
    )
}

function ShoppingCartPanel(){
    const {isLoged} = useUserJWT();

    const navigate = useNavigate();
    const [mouseOnShoppingCart, setMouseOnShoppingCart] = useState(false);

    const {listOfProducts, getAllProducts} = useShoppingCartContext();

    let totalPay = 0;

    useEffect(() => {
        getAllProducts();
    }, []);

    return(
        <div className='flex relative'>
            {/*Shopping Cart Button*/}
            <button className='flex shadow hover:shadow-inner border items-center rounded-full p-2'
                onClick={() => { isLoged ? setMouseOnShoppingCart(!mouseOnShoppingCart) : navigate('/login')}}>
                <div className='bg-black p-2 rounded-full'>
                    <BsFillCartFill className='text-white'/>
                </div>
            </button>

            {/*Shopping Cart Panel*/}
            <div className={`absolute lg:-left-[175px] -left-[100px] top-14 bg-white shadow rounded border w-[300px] lg:w-[400px] p-2 
                ${mouseOnShoppingCart ? '' : 'hidden'}`}>
                <div className='flex w-full p-2 bg-black rounded-t mb-2 text-white justify-center'>
                    <span className='font-bold'>
                        {'Shopping Cart'}
                    </span>
                </div>
                <ul className='flex flex-col gap-y-2 text-center h-[350px] overflow-y-scroll'>
                    {
                        listOfProducts?.map((product_item) => {
                            totalPay += product_item.price * product_item.quantity;

                            return (
                                <li className='w-full border border-black p-1 rounded text-[16px]' 
                                    key={crypto.randomUUID()}>
                                    <ShoppingCartProductCard id={product_item.id} stock={product_item.stock}
                                        image={product_item.image} name={product_item.name} price={product_item.price} 
                                        description={product_item.description} quantity={product_item.quantity} />
                                </li>
                            )
                        })
                    }
                </ul>
                <NavLink to='/user/shopping_cart' className='flex flex-row gap-x-1 w-full h-full 
                    justify-center bg-black text-white rounded-b p-2 mt-2'>
                    <span className='font-bold'>
                        {'Total:'}
                    </span>
                    <span>
                        {'$' + totalPay?.toFixed(2)}
                    </span>
                </NavLink>
                
            </div>
        </div>
    );
}