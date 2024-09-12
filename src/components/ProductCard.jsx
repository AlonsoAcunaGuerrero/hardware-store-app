import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartPlus } from "react-icons/fa";
import useUserJWT from '../hooks/UseUserJWT';
import { fetchAddProductToCart, fetchRemoveProductOfCart, fetchUpdateProductQuantityOnCart } from '../services/ShoppingCartService';

export function FullProductCard(props) {
    
    const navigate = useNavigate();
    const {isLoged} = useUserJWT('hardwareStoreAppUser');
    const [quantity, setQuantity] = useState(1);

    const fetchAddProduct = async () =>{
        await fetchAddProductToCart(props.name, quantity)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function clamp(num, min, max){
        return num <= min ? 
            min : num >= max ? 
            max : num;
    }

    return(
        <div className='flex flex-col rounded justify-between bg-white shadow-md border-2 p-4 
            hover:shadow-lg hover:scale-105 transition-all duration-100'>
            <Link to={`/product/find/${props.name}`}>
                <div className="flex justify-center mb-2 h-[175px] ">
                    <img src={`data:image;base64,${props.image}`} 
                    alt={`Photo of ${props.name}`} className="object-contain" />
                </div>
                <div className='flex justify-center mb-2 mt-4 text-black hover:text-slate-500 font-bold'>
                    {props.name}
                </div>
            </Link>
            <div className='flex flex-col gap-y-2 w-full'>
                <div className="flex justify-center">
                    {'$' + props.price}
                </div>
                
                <div className='flex flex-row w-full'>
                    <button className='flex bg-black text-white py-2 px-4 rounded-l'
                        onClick={() => {setQuantity(clamp(quantity - 1, 1, props.stock))}}>{'-'}</button>
                    <input type='number' name='productQuantityInput'
                        className='flex flex-1 border text-center input-number-without-arrow overflow-clip'
                        value={quantity} readOnly={true} />
                    <button className='flex bg-black text-white py-2 px-4 rounded-r'
                        onClick={() => {setQuantity(clamp(quantity + 1, 1, props.stock))}}>{'+'}</button>
                </div>
                
                <button className="flex flex-row bg-red-400 hover:bg-red-600 py-2 w-full rounded-full 
                    text-white items-center justify-center gap-1" 
                    onClick={() => {isLoged ? fetchAddProduct() : navigate('/login')}}>
                    <FaCartPlus className='text-[1.25em]' />
                    <span>{'Add to Cart'}</span>
                </button>
            </div>
        </div>
    );
}

export function RowProductCard(props) {
    const navigate = useNavigate();
    const {isLoged} = useUserJWT('hardwareStoreAppUser');
    const [quantity, setQuantity] = useState(1);

    const fetchAddProduct = async () =>{
        await fetchAddProductToCart(props.name, quantity)
        .then(() => {
            window.location.reload()
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function clamp(num, min, max){
        return num <= min ? 
            min : num >= max ? 
            max : num;
    }

    const listDescInfo = props.description?.split('|');

    return(
        <div className='flex flex-col lg:flex-row rounded gap-x-4 bg-white shadow-md border-2 p-4
            hover:ring-4 hover:ring-slate-600 transition-all duration-100'>
            <Link to={`/product/find/${props.name}`} className='flex justify-center items-center'>
                <div className='flex w-[175px]'>
                    <img src={`data:image/jpg;base64,${props.image}`} alt={`Photo of ${props.name}`} className='object-contain' />
                </div>
            </Link>
            <div className='flex flex-col gap-y-3 w-full h-full p-3 border'>
                <Link to={`/product/find/${props.name}`} className='text-xl font-bold'>
                    {props.name}
                </Link>
                <div className='flex flex-col gap-y-1 py-2'>
                    <span className='font-bold'>{'Description:'}</span>
                    <ul className='flex flex-col gap-y-2 list-inside list-disc'>
                        {
                            listDescInfo?.map((charac, index) =>
                                <li key={index}>
                                    {charac}
                                </li>)
                        }
                    </ul>
                </div>
                <div className='flex flex-col md:flex-row justify-between'>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <span className='font-bold'>
                            {'Price:'}
                        </span>
                        <span>
                            {'$' + props.price}
                        </span>
                    </div>
                    <div className='flex flex-col lg:flex-row gap-2 w-full lg:w-1/2'>
                        <div className='flex flex-row w-full'>
                            <button className='flex bg-black text-white py-2 px-4 rounded-l'
                                onClick={() => {setQuantity(clamp(quantity - 1, 1, props.stock))}}>{'-'}</button>
                            <input type='number' name='productQuantityInput' 
                                className='flex-1 border text-center input-number-without-arrow' 
                                value={quantity} 
                                onChange={(e) => {setQuantity(clamp(e.target.value, 1, props.stock))}} />
                            <button className='flex bg-black text-white py-2 px-4 rounded-r'
                                onClick={() => {setQuantity(clamp(quantity + 1, 1, props.stock))}}>{'+'}</button>
                        </div>
                        
                        <button className="flex flex-row bg-red-400 hover:bg-red-600 py-2 w-full rounded-full text-white
                            items-center justify-center gap-1" 
                            onClick={() => {isLoged ? fetchAddProduct() : navigate('/login')}}>
                            <FaCartPlus className='text-[1.25em]' />
                            <span>{'Add to Cart'}</span>
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export function ShoppingCartProductCard(props){
    const navigate = useNavigate();

    const {isLoged} = useUserJWT();

    const [quantity, setQuantity] = useState(props.quantity || 1);

    const fetchRemoveProduct = async () => {
        await fetchRemoveProductOfCart(props?.id)
        .then((res) => {window.location.reload()})
        .catch((err) => {
            console.log(err);
        });
    }

    const fetchUpdateProductQuantity = async () => {
        await fetchUpdateProductQuantityOnCart(props?.id, quantity)
        .then((res) => {window.location.reload()})
        .catch((err) => {
            console.log(err);
        });
    }

    function clamp(num, min, max){
        return num <= min ? 
            min : num >= max ? 
            max : num;
    }

    return(
        <div className='flex flex-col sm:flex-row items-center gap-x-4 p-2 w-full 
            hover:ring hover:ring-offset-1 hover:ring-black'>
            <Link to={`/product/find/${props.name}`} className='flex justify-center items-center h-[10em] w-[10em]'>
                <div className='flex h-full w-full'>
                    <img src={`data:image;base64,${props.image}`} alt={`Photo of ${props.name}`} className='object-contain' />
                </div>
            </Link>
            <div className='flex flex-col h-full w-full gap-y-2 py-2'>
                <Link to={`/product/find/${props.name}`} className='text-[0.8em] font-bold text-start'>
                    {props.name}
                </Link>
                <div className='flex flex-row text-[0.75em] gap-x-1'>
                    <span className='font-bold'>
                        {'Price:'}
                    </span>
                    <span>
                        {'$' + props.price?.toFixed(2)}
                    </span>
                </div>
                <div className='flex flex-row text-[0.75em] gap-x-1'>
                    <span className='font-bold'>
                        {'Total:'}
                    </span>
                    <span>
                        {'$' + (props.quantity * props.price)?.toFixed(2)}
                    </span>
                </div>
                <div className='flex flex-row gap-x-2 mt-auto'>
                    <button className='bg-red-400 hover:bg-red-600 py-2 rounded-full text-white w-1/2 text-[0.7em]'
                        onClick={() => {isLoged ? fetchRemoveProduct() : navigate('/login')}}>
                        {'Remove'}
                    </button>
                    {
                        props.quantity !== quantity?
                        (<button className='bg-orange-400 hover:bg-orange-600 py-2 px-4 rounded-full text-[0.7em] text-orange-100 w-1/2'
                            onClick={() => isLoged ? fetchUpdateProductQuantity() : navigate('/login')}>
                            {'Update'}
                        </button>) 
                        : null
                    }  
                </div>
                <div className='flex flex-row text[0.5em] w-full'>
                    <button className='flex bg-black text-white py-1 px-2 rounded-l'
                        onClick={() => {setQuantity(clamp(quantity - 1, 1, props.stock))}}>{'-'}</button>
                    <input type='number' name='scProductQuantityInput' readOnly
                        className='flex-1 border text-[0.7em] text-center input-number-without-arrow overflow-clip' 
                        value={quantity} />
                    <button className='flex bg-black text-white py-1 px-2 rounded-r'
                        onClick={() => {setQuantity(clamp(quantity + 1, 1, props.stock))}}>{'+'}</button>
                </div>              
            </div>
        </div>
    );
}