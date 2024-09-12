import { BaseTemplate } from '../Templates';
import { ErrorModal, LoadingModal, SuccessfulModal, TemplateModal, ACTIONS, PROCESS_STATUS } from '../../components/Modal';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsXLg, BsArrowReturnLeft  } from 'react-icons/bs';
import { IoHardwareChip } from "react-icons/io5";
import { FaSquareMinus, FaGear } from "react-icons/fa6";
import { FaArrowLeft, FaPlusSquare } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PanelButton, PanelActionButton } from './AdminPage';
import { fetchAdminAddProduct, fetchAdminRemoveProductByID, fetchAdminUpdateProduct, fetchAllProducts, fetchAllProductsBySearch, fetchProductByID } from '../../services/ProductService';
import { fetchAllProductTypes } from '../../services/ProductTypeService';

export default function ProductsControlPage(){
    document.title = 'Admin - Products Panel'

    const [currentAction, setCurrentAction] = useState(ACTIONS.NONE);

    return(
        <BaseTemplate>
            {
                currentAction == ACTIONS.NONE ?
                null :
                currentAction == ACTIONS.ADD ?
                (<AddProductModal title={'Add New Product'} close={() => setCurrentAction(ACTIONS.NONE)} />) : 
                currentAction == ACTIONS.EDIT ? 
                (<UpdateProductModal title={'Update Product'} close={() => setCurrentAction(ACTIONS.NONE)} />) :
                currentAction == ACTIONS.DELETE ?
                (<RemoveProductModal title={'Remove Product'} close={() => setCurrentAction(ACTIONS.NONE)} />) : null
            }
            <section className='flex flex-1 justify-center'>
                <div className='flex w-[75%]'>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full text-[1.25rem]'>
                        <PanelButton text={'Return'} url={'./'}>
                            <BsArrowReturnLeft className='flex text-[10em]' />
                        </PanelButton>
                        <PanelActionButton text={'Add Product'} color={'bg-lime-300'}
                            action={ACTIONS.ADD} changeAction={setCurrentAction}>
                            <div className='flex flex-row items-end'>
                                <IoHardwareChip className='flex text-[7em]' />
                                <FaPlusSquare className='flex text-[2em]'/>
                            </div>
                        </PanelActionButton>
                        <PanelActionButton text={'Edit Product'} color={'bg-yellow-200'}
                            action={ACTIONS.EDIT} changeAction={setCurrentAction}>
                            <div className='flex flex-row items-end'>
                                <IoHardwareChip className='flex text-[7em]' />
                                <FaGear className='flex text-[2em]'/>
                            </div>
                        </PanelActionButton>
                        <PanelActionButton text={'Delete Product'} color={'bg-red-300'}
                            action={ACTIONS.DELETE} changeAction={setCurrentAction}>
                            <div className='flex flex-row items-end'>
                                <IoHardwareChip className='flex text-[7em]' />
                                <FaSquareMinus className='flex text-[2em]'/>
                            </div>
                        </PanelActionButton>
                    </div>
                </div>
            </section>
        </BaseTemplate>
    );
}

function AddProductModal({ close, title }){
    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchAddProduct = async (data) =>{
        await fetchAdminAddProduct(data)
            .then((res) => {
                setCurrentStatus(PROCESS_STATUS.SUCCESSFUL);
            })
            .catch((err) => {
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            })
    }

    const onSubmit = (data) => {
        setCurrentStatus(PROCESS_STATUS.LOADING);
        fetchAddProduct(data);
    }

    return(
        <TemplateModal title={title} close={close}>
            {
                currentStatus == PROCESS_STATUS.LOADING ?
                (<LoadingModal message={'Adding the new product...'} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal message={errorMsg} 
                    close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal message={'Successful adding the new product.'} 
                    close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                (<ProductForm buttonText={'Add Product'} actionSubmit={onSubmit} />)
            }
        </TemplateModal>
    )
}

function UpdateProductModal({ close, title }){
    const [product, setProduct] = useState(null); 

    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.FIND);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchProduct = async (id) => {
        await fetchProductByID(id)
            .then((res) => {
                setProduct(res);
                setCurrentStatus(PROCESS_STATUS.NONE);
            })
            .catch((err) => {
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setProduct(null);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            })
    }

    const fetchUpdateProduct = async (data) => {
        await fetchAdminUpdateProduct({
            id: data?.id,
            name: data?.name,
            description: data?.description,
            price: data?.price,
            stock: data?.stock,
            image: data?.image,
            type: data?.type
        })
        .then((res) => {
            setCurrentStatus(PROCESS_STATUS.SUCCESSFUL);
        })
        .catch((err) => {
            let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

            setErrorMsg(newErrorMsg);
            setProduct(null);
            setCurrentStatus(PROCESS_STATUS.ERROR);
        });
    }

    const selectProduct = (id) =>{
        if(id != 0){
            fetchProduct(id);
        }
    }

    const onSubmit = (data) => {
        fetchUpdateProduct(data);
    }

    return(
        <TemplateModal title={title} close={close}>
            {
                currentStatus == PROCESS_STATUS.FIND ?
                (<SearchProducts action={selectProduct} />) :
                currentStatus == PROCESS_STATUS.LOADING ?
                (<LoadingModal Message={'Updating product...'} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal Message={errorMsg} 
                    close={() => setCurrentStatus(PROCESS_STATUS.FIND)} />) :
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal Message={'Successful updating the product'} 
                    close={() => setCurrentStatus(PROCESS_STATUS.FIND)} />) :
                (<>
                    <button type='button' className='bg-black text-[2em]
                        hover:bg-white hover:text-black hover:shadow border-2 border-transparent 
                        hover:border-black p-2 rounded text-white transition delay-[5ms]'
                        onClick={() => setCurrentStatus(PROCESS_STATUS.FIND)}>
                        <FaArrowLeft />
                    </button>
                    <ProductForm product={product} buttonText={'Update Product'} actionSubmit={onSubmit} />
                </>)
            }
        </TemplateModal>
    )
}

function RemoveProductModal({ close, title }){
    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchRemoveProductByID = async (id) => {
        setCurrentStatus(PROCESS_STATUS.LOADING);

        await fetchAdminRemoveProductByID(id)
        .then((res) => {
            setCurrentStatus(PROCESS_STATUS.SUCCESSFUL);
        })
        .catch((err) => {
            let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

            setErrorMsg(newErrorMsg);
            setCurrentStatus(PROCESS_STATUS.ERROR);
        });
    }

    return(
        <TemplateModal title={title} close={(close)}>
            {
                currentStatus == PROCESS_STATUS.LOADING ?
                (<LoadingModal Message={'Deleting product...'} />) :
                currentStatus == PROCESS_STATUS.ERROR ?
                (<ErrorModal Message={errorMsg} 
                    close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                currentStatus == PROCESS_STATUS.SUCCESSFUL ?
                (<SuccessfulModal Message={'Successful deleting the product'} 
                    close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                (<SearchProducts action={fetchRemoveProductByID} 
                    buttonStyle={'bg-red-400 hover:bg-red-500 rounded p-2 text-[2em]'}>
                </SearchProducts>)
            }
        </TemplateModal>
    )
}

function ProductForm({ product = null, buttonText, actionSubmit }){
    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm();
    const [selectedFile, setSelectedFile] = useState(null);
    const [listOfDescription, setListOfDescription] = useState([]);
    const [listOfTypes, setListOfTypes] = useState([]);    
    
    const fetchProductsType = async () =>{
        await fetchAllProductTypes()
            .then((res) => setListOfTypes(res))
            .catch((err) => console.log(err));
    }

    const listDescriptions = (value) =>{
        if(value.length > 0){
            const newList = value?.split('\n')
            setListOfDescription(newList)
        }else{
            setListOfDescription([]);
        }
    }

    const previewImage = (files) =>{
        if(files.length > 0){
            let reader = new FileReader();

            reader.onload = function(evt) {
                if(evt.target.readyState != 2) {
                    return;
                }

                if(evt.target.error) {
                    return;
                }
        
                setSelectedFile(evt.target.result)
            };

            reader.readAsDataURL(files[0]);
        }else{
            setSelectedFile(null);
        }
        
    }

    const onSubmit = handleSubmit((data) => {
        if(selectedFile){
            let img = null;

            if (selectedFile.startsWith('data:')) {
                let arr = selectedFile.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let bstr = atob(arr[arr.length - 1])
                let n = bstr.length
                let  u8arr = new Uint8Array(n);
                
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }

                let extension = mime.split('/')[1]
                img = new File([u8arr], `${data.name}.${extension}`, {type: mime});
            }

            let formData = {
                id: product ? product?.id_products : 0,
                name: data.name,
                description: listOfDescription.join("|"),
                price: data.price,
                stock: data.stock,
                image: img,
                type: data.type
            }
            
            actionSubmit(formData);
        }
    })

    const loadData = async() =>{
        await fetchProductsType();

        if(product){
            setValue('name', product?.name);
            setValue('description', product?.description);
            listDescriptions(product?.description);
            if(product?.image?.includes('data:image/jpg;base64,')){
                setSelectedFile(product?.image);
            }else{
                setSelectedFile('data:image/jpg;base64,' + product?.image);
            }
            setValue('price', product?.price);
            setValue('stock', product?.stock);
            setValue('type', product?.type?.id_product_types);
        }
    }

    useEffect(() =>{
        loadData();
    }, []);

    return(
        <form onSubmit={onSubmit} className='flex flex-col gap-2'>
            <div className='grid grid-cols-6 overflow-x-scroll gap-y-2 items-center h-[450px] p-2'>
                {/*Name*/}
                <label className='col-span-2' htmlFor='name'>Name</label>
                <input type='text' {...register('name', {
                        required: {
                            value: true,
                            message: 'The name is required',
                        },
                        minLength: {
                            value: 5,
                            message: 'The name required 5 characters at least',
                        },
                        maxLength: {
                            value: 100,
                            message: 'The name can have 150 characters maximum',
                        },
                        validate: (value) =>{
                            let name = String(value);
                            let response = true;

                            if(name.includes('/')){
                                response = false;
                            }

                            return response || 'The name cant contain characters like "/"';
                        }
                    })} 
                    className='border-2 focus:border-slate-800 col-span-4 p-2' 
                    placeholder='Name...' name='name' />
                {
                    errors.name ? 
                    <div className='col-end-7 col-span-4 mb-3'>
                        <p>{errors.name.message}</p>
                    </div> : null
                }

                {/*Description*/}
                <label className='col-span-2' htmlFor='description'>Description</label>
                <div className='flex flex-col border-2 col-span-4 p-2 gap-2'>
                    <textarea {...register('description', {
                        required: {
                            value: true,
                            message: 'The description is required',
                        },
                        minLength: {
                            value: 20,
                            message: 'The description required 20 characters at least',
                        },
                        maxLength: {
                            value: 750,
                            message: 'The description can have 750 characters maximum'
                        }
                        })}
                        className='border-2 focus:border-slate-800 col-span-4 p-2 resize-none 
                        h-[100px] w-full' 
                        placeholder='Description...' name='description'
                        onChange={(e) => listDescriptions(e.target.value)} />
                    <ul className={`${listOfDescription.length > 0 ? 'flex' : 'hidden'} flex-col p-1 gap-2 list-inside list-disc`}>
                        {
                            listOfDescription?.map((item, index) => (
                                <li key={index} className='overflow-clip'>
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {
                    errors.description ? 
                    <div className='col-end-7 col-span-4 mb-3'>
                        <p>{errors.description.message}</p>
                    </div> : null
                }

                {/*Price*/}
                <label className='col-span-2' htmlFor='price'>Price</label>
                <div class='relative block col-span-4'>
                    <span class="flex absolute inset-y-0 left-0 text-[1.5rem] text-slate-300 
                        items-center pl-2">
                        <MdOutlineAttachMoney />
                    </span>
                    <input type='number' {...register('price', {
                        required: {
                            value: true,
                            message: 'The price is required',
                        },
                        pattern: {
                            value: /^[0-9]+([\.,][0-9]+)??$/,
                            message: 'The price is not valid use a pattern like 10.00',
                        },
                        validate: (value) =>{
                            let response = false;

                            if(value > 0){
                                response = true;
                            }

                            if(String(value).includes('.')){
                                let list = String(value).split('.');

                                let decimals = list[list.length - 1];

                                if(decimals >= 1 && decimals <= 2){
                                    response = true;
                                }
                            }

                            return response || 'The price cant be least or equal of 0'
                        }
                    })}
                        className='border-2 focus:border-slate-800 pl-10 p-2 w-full' 
                        placeholder='Price...' name='price'
                        min={0} step={0.01} />
                </div>
                {
                    errors.price ? 
                    <div className='col-end-7 col-span-4 mb-3'>
                        <p>{errors.price.message}</p>
                    </div> : null
                }
                
                {/*Stock*/}
                <label className='col-span-2' htmlFor='stock'>Stock</label>
                <input type='number' {...register('stock',{
                        required: {
                            value: true,
                            message: 'The stock is required',
                        }
                    })}
                        className='border-2 focus:border-slate-800 col-span-4 p-2 w-full' 
                        placeholder='Stock...' name='stock' min={0} />
                {
                    errors.stock ? 
                    <div className='col-end-7 col-span-4 mb-3'>
                        <p>{errors.stock.message}</p>
                    </div> : null
                }

                {/*Image*/}
                <label className='col-span-2' htmlFor='image'>Image</label>
                <div className='flex flex-col col-span-4 border-2 gap-2 p-2 w-full'>
                    <input type='file'
                        className='border-2 focus:border-slate-800 p-2 w-full'
                        name='image' onChange={(e) => previewImage(e.target.files)} />
                    {
                        selectedFile ? 
                        (<img src={selectedFile} />) : null
                    }
                </div>
                {
                    errors.image ? 
                    <div className='col-end-7 col-span-4 mb-3'>
                        <p>{errors.image.message}</p>
                    </div> : null
                }

                <label className='col-span-2' htmlFor='type'>Type</label>
                <select className='border-2 focus:border-slate-800 col-span-4 p-2'
                    {...register('type', {
                        required: {
                            value: true,
                            message: 'Select a correct type'
                        },
                        validate: (value) => {
                            return value != null && value != undefined || 'The type is not valid';
                        }
                        })} name='type'>
                    <option value={null}>Select...</option>
                    {
                        listOfTypes.map((type) =>
                        (
                            <option value={type?.name}>{type?.name}</option>
                        ))
                    }
                </select>
                {
                    errors.type ? 
                    <div className='col-end-7 col-span-4 mb-3'>
                        <p>{errors.type.message}</p>
                    </div> : null
                }
            </div>
            <button type='submit' className='bg-black 
                hover:bg-white hover:text-black hover:shadow border-2 border-transparent hover:border-black
                p-2 mt-4 rounded text-white transition delay-[5ms]'>
                {buttonText}
            </button>
        </form>
    )
}

function SearchProducts({ action, buttonStyle }){
    const FILTERS = {
        ID: 0,
        NAME: 1,
    }

    const [currentFilter, setCurrentFilter] = useState(FILTERS.ID);
    const [searchText, setSearchText] = useState('');
    const [listOfProducts, setListOfProducts] = useState([]);

    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchProducts = async () =>{
        await fetchAllProducts()
        .then((res) => {
            setListOfProducts(res.listOfProducts);
            setCurrentStatus(PROCESS_STATUS.NONE);
        })
        .catch((err) => {
            setListOfProducts([]);
            let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

            setErrorMsg(newErrorMsg);
            setCurrentStatus(PROCESS_STATUS.ERROR);
        });
    }

    const fetchFilterProductsByName = async (search) => {
        await fetchAllProductsBySearch(search)
            .then((res) => setListOfProducts(res.listOfProducts))
            .catch((err) => {
                setListOfProducts([]);
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            })
            .finally(() => {setCurrentStatus(PROCESS_STATUS.NONE)})
    }

    const fetchFilterProductsByID = async (id) => {
        await fetchProductByID(id)
            .then((res) => {
                let newList = []
                newList.push(res)

                setListOfProducts(newList);
                setCurrentStatus(PROCESS_STATUS.NONE)
            })
            .catch((err) => {
                setListOfProducts([]);
                let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

                setErrorMsg(newErrorMsg);
                setCurrentStatus(PROCESS_STATUS.ERROR);
            })
    }

    const refreshData = () => {
        if(searchText.length > 0){
            setCurrentStatus(PROCESS_STATUS.LOADING);
        
            if(currentFilter == FILTERS.NAME){
                fetchFilterProductsByName(searchText);
            }
    
            if(currentFilter == FILTERS.ID){
                fetchFilterProductsByID(searchText);
            }
        }else{
            setCurrentStatus(PROCESS_STATUS.LOADING);
            fetchProducts();
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        refreshData();
    }

    useEffect(() => {
        refreshData();
    }, [])

    return(
        <form onSubmit={onSubmit} className='flex flex-col gap-2'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-row items-center gap-2 w-full'>
                    <label htmlFor="filter">Filter By</label>
                    <select className='border-2 focus:border-slate-800 p-2' name='filter'
                        onChange={(e) => setCurrentFilter(e.target.value)}>
                        <option value={FILTERS.ID}>ID</option>
                        <option value={FILTERS.NAME}>Name</option>
                    </select>

                    {
                        currentFilter == FILTERS.ID ? 
                        (<>
                            <label htmlFor="filter_by_id">Product ID: </label>
                            <input type='number' name='filter_by_id'
                                className='flex flex-1 border-2 focus:border-slate-800 p-2' min={1}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)} />
                        </>) :
                        currentFilter == FILTERS.NAME ?
                        (<>
                            <label htmlFor="filter_by_name">Product Name: </label>
                            <input type='text' name='filter_by_name'
                                className='flex flex-1 border-2 focus:border-slate-800 p-2 w-full'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)} />
                        </>) : null
                    }
                    <button type='submit' className='bg-black text-white
                        hover:bg-white hover:text-black hover:shadow 
                        border-2 border-transparent hover:border-black
                        p-2 rounded transition delay-[5ms]'>
                        Search
                    </button>
                </div>

                <div className='relative flex overflow-scroll h-[450px] w-full p-1'>
                    {
                        currentStatus == PROCESS_STATUS.LOADING ?
                        (<LoadingModal message={'Loading products...'} />) :
                        currentStatus == PROCESS_STATUS.ERROR ?
                        (<ErrorModal message={errorMsg} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} />) :
                        (<ul className='flex flex-col h-full w-full p-1 gap-2'>
                            {
                                listOfProducts?.map((product) => (
                                    <ProductCard id={product?.id_products} name={product?.name}
                                        image={product?.image} description={product?.description}
                                        type={product?.type?.name}>
                                        <button
                                            className={buttonStyle || 'bg-black hover:bg-slate-700 rounded p-2 text-white text-[2em]'}
                                            onClick={async () => {
                                                setCurrentStatus(PROCESS_STATUS.LOADING);
                                                await action(product?.id_products);
                                                refreshData();
                                            }}>
                                            <BsXLg />
                                        </button>
                                    </ProductCard>
                                ))
                            }
                        </ul>)
                    }
                </div>
            </div>
        </form>
    )
}

function ProductCard({id, image, name, description, type, children}){
    return(
        <li key={id} className='flex flex-row rounded border shadow p-2 gap-2 text-[1rem]'>
            <div className='flex flex-col h-full w-1/5'>
                <img src={`data:image/png;base64,${image}`} alt={name}
                    className='object-contain' />
                <div className='flex flex-row gap-1'>
                    <span className='font-bold'>ID:</span>
                    <span>{id}</span>
                </div>
            </div>
            <div className='flex flex-col w-full'>
                <div className='flex flex-col'>
                    <span className='font-bold'>{'[Type] Name:'}</span>
                    <span>{`[${type}]-${name}`}</span>
                </div>
                <div className='flex flex-col'>
                    <span className='font-bold'>Description:</span>
                    <span>{description}</span>
                </div>
            </div>
            {children}
        </li>
    );
}