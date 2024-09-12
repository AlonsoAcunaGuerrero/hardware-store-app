import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { BaseTemplate } from './Templates';
import useUserJWT from '../hooks/UseUserJWT';
import { LoadingModal } from '../components/Modal';
import { fetchAddProductToCart } from '../services/ShoppingCartService';
import { fetchProductByName } from '../services/ProductService';

export default function InfoProductPage() {

    const {name} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [quantity, setQuantity] = useState(1);

    document.title = name;

    const {isLoged} = useUserJWT('hardwareStoreAppUser');

    const fetchAddProduct = async () =>{
        await fetchAddProductToCart(data?.name, quantity)
        .then((res) => navigate('/products?page=1&limit=12&display=G'))
        .catch((err) => {
            console.log(err)
        });
    }

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);

            await fetchProductByName(name)
            .then((res) => {
                setData(res);
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => setLoading(false));
        }

        window.scrollTo(0, 0);
        fetchProduct();
    }, []);

    const listCharac = data?.description?.split('|');

    function clamp(num, min, max){
        return num <= min ? 
            min : num >= max ? 
            max : num;
    }

    return(
        <BaseTemplate>
            {
                loading ? 
                (<LoadingModal transparent={true} />)
                :
                (data ? 
                (<div className='flex flex-col lg:flex-row gap-4 justify-center w-full p-4'>
                    <div className='flex justify-center items-start sm:w-[500px]'>
                        <img src={`data:image;base64,${data.image}`} alt={`Photo of ${data.name}`} 
                        className="object-contain"/>
                    </div>
                    
                    <div className='flex flex-col gap-y-4 md:ml-6 w-full lg:w-1/3'>
                        <h1 className='text-2xl font-semibold'>{data.name}</h1>
                        <div className='flex flex-row gap-x-1'>
                            <span className='font-bold'>
                                {'Price:'}
                            </span>
                            <span>
                                {'$' + data.price}
                            </span>
                        </div>
                        {
                            data.stock == 0 ? 
                            (
                                <div className='flex'>
                                    <div className='bg-red-500 text-white py-2 px-6 rounded-full'>
                                        Out of Stock
                                    </div>
                                </div>
                            )
                            :
                            (<div className='flex flex-col xl:flex-row gap-2'>
                                <div className='flex flex-row items-center justify-center'>
                                    <button className='bg-black text-white py-2 px-4 rounded-l'
                                        onClick={() => {setQuantity(clamp(quantity - 1, 1, data.stock))}}>{'-'}</button>
                                    <input type='number' name='productQuantityInput' 
                                        className='h-full border text-center input-number-without-arrow' 
                                        value={quantity}
                                        onChange={(e) => {setQuantity(clamp(e.target.value, 1, data.stock))}} />
                                    <button className='bg-black text-white py-2 px-4 rounded-r'
                                        onClick={() => {setQuantity(clamp(quantity + 1, 1, data.stock))}}>{'+'}</button>
                                </div>

                                <button className='bg-red-400 hover:bg-red-600 py-2 px-8 rounded-full text-white w-full'
                                    onClick={() => isLoged ? fetchAddProduct() : {}}>
                                    {'Add to Cart'}
                                </button>
                            </div>)
                        }
                        <div className='flex flex-col border shadow p-4'>
                            <h3 className='font-bold'>
                                {'Description:'}
                            </h3>
                            <ul className='flex flex-col list-inside list-disc'>
                                {listCharac?.map((charac, index) => (
                                    <li key={index}>
                                        {charac}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>) : 
                (<Navigate to='/home' />)) 
            }
        </BaseTemplate>
    );
}