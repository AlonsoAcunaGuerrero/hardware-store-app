"use client"
import { useEffect, useState } from 'react';
import { BsCaretUpFill } from "react-icons/bs";
import { BaseTemplate } from './Templates';
import { ShoppingCartProductCard } from '../components/ProductCard';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useShoppingCartContext } from '../context/ShoppingCartProvider';
import { fetchAllAddress } from '../services/AddressService';
import { fetchAllShippingMethods } from '../services/ShippingMethodService';
import { fetchAddOrder } from '../services/OrderService';

export default function ShoppingCartPage(){
    document.title = 'Shopping Cart';
    
    const { clearShoppingCart } = useShoppingCartContext();

    useEffect(() =>{
        window.scrollTo(0, 0);
    }, []);

    return(
        <BaseTemplate>
            <div className='flex flex-1 flex-col gap-y-2 w-full overflow-clip'>
                <div className='flex flex-col sm:flex-row bg-black p-3 rounded justify-between text-white gap-2 w-full'>
                    <span className='text-[2em] font-bold self-center'>
                        {'Shopping Cart ' + storedUserName}
                    </span>
                    <button className='bg-black border-2 border-white text-[1.25em] text-white hover:bg-white 
                        hover:text-black rounded py-1 px-4'
                        onClick={() => clearShoppingCart()}>
                        {'Clean Shopping Cart'}
                    </button>
                </div>

                <div className='flex flex-col-reverse sm:flex-row flex-1 gap-2 w-full h-full'>
                    {/*List of Products*/}
                    <ShoppingCartProductsPanel />

                    {/*Payout*/}
                    <OrderPanel />
                </div>
            </div>
        </BaseTemplate>
    );
}

function ShoppingCartProductsPanel(){

    const {listOfProducts, getAllProducts} = useShoppingCartContext();

    useEffect(() => {
        getAllProducts();
    }, []);

    return(
        <div className='flex w-full sm:w-2/3'>
            <ul className='flex flex-col w-full gap-2'>
                {
                    listOfProducts?.map((product_item, index) => {
                        return (
                            <li className='flex flex-row w-full border border-black p-1 rounded text-[24px]' key={index}>
                                <ShoppingCartProductCard id={product_item.id_products} 
                                    image={product_item.image} name={product_item.name} 
                                    price={product_item.price} description={product_item.description}
                                    quantity={product_item.quantity} total={product_item.price * product_item.quantity} />
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

function OrderPanel(){
    const {listOfProducts, getAllProducts} = useShoppingCartContext();
    const [showCheckoutPanel, setShowCheckoutPanel] = useState(false);
    const [subTotal, setSubTotal] = useState(() => {
        let sum = 0;

        listOfProducts?.map((product_item) => {
            sum += product_item.price * product_item.quantity;
        });

        return sum;
    });
    
    const [taxes, setTaxes] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [total, setTotal] = useState(0);

    const CalculatedFinalValues = () =>{
        let sum = 0;

        listOfProducts?.map((product_item) => {
            sum += product_item.price * product_item.quantity;
        });

        setSubTotal(sum);
        setTaxes(subTotal * 0.12);
        setTotal(subTotal + taxes + shipping);
    }

    useEffect(() =>{
        getAllProducts();
        CalculatedFinalValues();
    }, [listOfProducts, subTotal, taxes, shipping]);

    return(
        <div className='flex flex-col items-center bg-black p-3 rounded text-white text-[20px] gap-2  w-full sm:w-1/3'>
            {/*Order Values*/}
            <div className='grid grid-cols-2 gap-2 w-full'>
                <span className='font-bold'>
                    {'Sub-Total:'}
                </span>
                <span className='w-full text-end'>
                    {'$' + subTotal?.toFixed(2)}
                </span>
                <span className='font-bold'>
                    {'Taxes (12%):'}
                </span>
                <span className='w-full text-end'>
                    {'$' + taxes?.toFixed(2)}
                </span>
                <span className='font-bold'>
                    {'Shipping:'}
                </span>
                <span className='w-full text-end'>
                    {'$' + shipping?.toFixed(2)}
                </span>
                <span className='font-bold'>
                    {'Total:'}
                </span>
                <span className='w-full text-end'>
                    {'$' + total?.toFixed(2)}
                </span>
            </div>
            <div className='flex flex-col w-full h-full'>
                {
                    showCheckoutPanel ? 
                    (<ProcessOrder 
                        returnAction={() => setShowCheckoutPanel(false)}
                        setShippingPrice={(value) => setShipping(value)} />) : 
                    (<button className={'flex justify-center items-center font-bold bg-black border-2 border-white hover:bg-white hover:text-black transition delay-75 w-full p-2 rounded'}
                        onClick={() => {setShowCheckoutPanel(true)}}>
                        {"Checkout"}
                    </button>)
                }
            </div>
        </div>
    );
}

function ProcessOrder({returnAction, setShippingPrice}){

    let paypalClientID = import.meta.env.VITE_PAYPAL_PUBLIC_KEY;

    const [addressID, setAddressID] = useState(0);
    const [shippingMethodsID, setShippingMethodsID] = useState(0);

    const [listOfAddress, setListOfAddress] = useState([]);
    const [listOfShippingMethods, setListOfShippingMethods] = useState([]);

    const fetchAddress = async () => {
        await fetchAllAddress()
        .then((res) => setListOfAddress(res)).catch((err) => console.log(err));
    }

    const fetchShippingMethods = async () => {
        await fetchAllShippingMethods()
        .then((res) => setListOfShippingMethods(res)).catch((err) => console.log(err));
    }

    useEffect(() =>{
        fetchAddress();
        fetchShippingMethods();
    }, []);
    
    return(
        <div className='flex flex-col gap-y-2 w-full'>
            {/*Header*/}
            <div className='flex flex-row w-full mb-2'>
                <button className='flex justify-center items-center font-bold bg-black border-2 border-white 
                    hover:bg-white hover:text-black transition delay-75 p-2 rounded'
                    onClick={() => returnAction()}>
                    <BsCaretUpFill className='-rotate-90' />
                </button>
                <h2 className='flex font-bold text-[1.5rem] justify-center w-full'>
                    {'Order Details'}
                </h2>
            </div>
            {/*Address Selector*/}
            <div className='flex flex-row w-full'>
                <label htmlFor='cbxAddress' className='flex items-center w-1/4'>{"Address:"}</label>
                 <select name='cbxAddress' 
                    className='text-black rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                        focus:ring-4 focus:ring-slate-600 
                        transition-all duration-150 w-3/4'
                        onChange={(e) => setAddressID(e.target.value)}>
                        <option key={0} value={0}>{'Select'}</option>
                        {
                            listOfAddress.map((address) => (
                                <option key={address?.id_address} value={address?.id_address}>
                                    {address?.unit_number + "-" + address?.street_number + 
                                    "[" + address?.city.city_name + "- " + address?.country.country_name + "]"}
                                </option>
                            ))
                        }
                </select>
            </div>
            {/*Shipping Method Selector*/}
            <div className='flex flex-row w-full'>
                <label htmlFor='cbxAddress' className='flex items-center w-1/4'>{"Shipping Method:"}</label>
                 <select name='cbxAddress' 
                    className='text-black rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                        focus:ring-4 focus:ring-slate-600 
                        transition-all duration-150 w-3/4'
                        onChange={(e) => 
                            {
                                setShippingMethodsID(e.target.value)
                                
                                if(e.target.value != 0){
                                    setShippingPrice(listOfShippingMethods[e.target.value - 1]?.price);
                                }
                                else{
                                    setShippingPrice(0);
                                }
                            }
                        }>
                        <option key={0} value={0}>{'Select'}</option>
                        {
                            listOfShippingMethods.map((shippingMethod) => (
                                <option key={shippingMethod?.id} 
                                    value={shippingMethod?.id}>
                                    {shippingMethod?.name + ` ($${shippingMethod?.price})`}
                                </option>
                            ))
                        }
                </select>
            </div>
            <div className='flex w-full'>
            {
                addressID != 0 && shippingMethodsID != 0 ?
                (
                    <PayPalScriptProvider options={{clientId: paypalClientID}}>
                        <PayPalButtons className='w-full' style={{
                            color: 'white',
                            layout: 'horizontal',
                            label: 'checkout',
                            tagline: false,
                        }} 
                        createOrder={async() => {
                                var orderID = "";

                                await fetchAddOrder({addressID, shippingMethodsID})
                                    .then((res) => {orderID = res?.id;})
                                    .catch((err) => {
                                        console.log(err)
                                    });
                                
                                return orderID;
                            }
                        }
                        
                        />
                    </PayPalScriptProvider>
                ) : null
            }
            </div>
        </div>
    );
}