import { FullProductCard, RowProductCard } from '../components/ProductCard';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { fetchAllProductTypes } from '../services/ProductTypeService';

export function GridProductsContainer({ products }){
    return(
        <div className='flex flex-col p-2'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                { 
                    products?.map((product) => 
                    <FullProductCard 
                        key={product.id} 
                        id={product.id}
                        image={product.image} 
                        name={product.name} 
                        price={product.price}
                    />)
                }
            </div>
        </div>
    );
}

export function ListProductsContainer({ products }){
    return(
        <div className='flex py-2 w-full'>
            <div className='flex flex-col gap-4 w-full'>
                { 
                    products?.map((product) => 
                    <RowProductCard 
                        key={product.id} 
                        id={product.id}
                        image={product.image} 
                        name={product.name}
                        stock={product.stock}
                        price={product.price}
                        description={product.description}
                    />)
                }
            </div>
        </div>
    );
}

export function ComponentsMenu(){
    const [listOfTypes, setListOfTypes] = useState([]);
 
    useEffect(() =>{
        const fetchTypes = async () => {
            await fetchAllProductTypes()
            .then((res) => setListOfTypes(res))
            .catch((err) => console.log(err));
        }

        fetchTypes();
    }, []);

    return(
        <div className='shadow-md border-2 md:flex md:flex-col hidden px-4 py-2'>
            <h2 className='p-4 text-xl text-center font-bold whitespace-nowrap'>Hardware Types</h2>
            <ul className='flex flex-col gap-y-2'>
                { 
                    listOfTypes?.map((type_product) =>
                    <li className='block' key={type_product.id}>
                        <NavLink to={`/products/${type_product.name}`} 
                            className={({isActive}) => isActive ? 'flex justify-center px-4 py-2 bg-black text-white' 
                            : 'flex justify-center px-4 py-2 hover:bg-black hover:text-white hover:rounded whitespace-nowrap'}>
                                {type_product.name}
                        </NavLink>
                    </li>)
                }
            </ul>
        </div>
    )
}

