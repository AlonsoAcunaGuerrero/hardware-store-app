import { BsChevronUp, BsPaypal } from 'react-icons/bs';
import { BaseTemplate } from './Templates';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TemplateModal } from '../components/Modal';
import { fetchUserData } from '../services/UserService';
import { fetchAddAddress, fetchAllAddress, fetchAllCitiesByRegionID, fetchAllCountries, fetchAllRegionsByCountryID } from '../services/AddressService';
import { fetchAllOrders, fetchOrderByID } from '../services/OrderService';

export default function UserProfilePage(){
    document.title = 'User Profile';
    
    const [userData, setUserData] = useState(null);
    const [orderID, setOrderID] = useState(null);

    const [listOfAddress, setListOfAddress] = useState([]);
    const [listOfOrders, setListOfOrders] = useState([]);

    const [showNewAddress, setShowNewAddress] = useState(false);
    const [showUserData, setShowUserData] = useState(false);
    const [showUserAdress, setShowUserAdress] = useState(false);
    const [showPaidMethods, setShowPaidMethods] = useState(false);

    const fetchUserInfo = async () => {
        await fetchUserData()
        .then((res) => setUserData(res)).catch((err) => console.log(err));
    }

    const fetchAddress = async () => {
        await fetchAllAddress()
        .then((res) => setListOfAddress(res)).catch((err) => console.log(err));
    }

    const fetchOrders = async () => {
        await fetchAllOrders()
        .then((res) => setListOfOrders(res)).catch((err) => console.log(err));
    }

    useEffect(() =>{
        window.scrollTo(0, 0);
        fetchUserInfo();
        fetchAddress();
        fetchOrders();
    }, []);
    
    let userBirthdate = new Date(userData?.birthdate);
    let day = userBirthdate.getDate().toString().padStart(2, "0");
    let month = (userBirthdate.getMonth() + 1).toString().padStart(2, "0");
    let year = userBirthdate.getFullYear().toString();

    let birthDate = day + '/' + month + '/' + year;

    return(
        <BaseTemplate>
            {
                showNewAddress ? (<NewAddressForm closeForm={setShowNewAddress} updateAddressList={() => fetchAddress()}/>)
                : null
            }

            <div className='flex flex-col flex-1 justify-start items-center gap-y-4'>
                <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-4'>
                    {/*User Data*/}
                    <DropdownPanel panelTitle={'User Data'} isShowing={showUserData} 
                        changeVisibility={() => setShowUserData(!showUserData)}>
                        <div className='grid grid-cols-3 gap-2'>
                            {/*Username*/}
                            <span className='font-bold col-span-1'>{'Username:'}</span>
                            <span>{userData?.username}</span>
                            <button className='flex justify-center bg-white text-black 
                                hover:bg-black border-2 hover:text-white border-black rounded py-1 px-4
                                transition-all duration-150'>
                                {'Change Username'}
                            </button>
                            {/*Email*/}
                            <span className='font-bold col-span-1'>{'Email:'}</span>
                            <span className='col-span-2'>{userData?.email}</span>
                            {/*Password*/}
                            <span className='font-bold col-span-1'>{'Password:'}</span>
                            <span>{userData?.password}</span>
                            <button className='flex justify-center bg-white text-black 
                                hover:bg-black border-2 hover:text-white border-black rounded py-1 px-4
                                transition-all duration-150'>
                                {'Change Password'}
                            </button>
                            <span className='font-bold col-span-1'>{'Birthdate:'}</span>
                            <span className='col-span-2'>{birthDate}</span>
                        </div>
                    </DropdownPanel>

                    {/*Paid Methods*/}
                    <DropdownPanel panelTitle={'Paid Methods'} isShowing={showPaidMethods}
                        changeVisibility={() => setShowPaidMethods(!showPaidMethods)}>
                    </DropdownPanel>

                    {/*Address*/}
                    <DropdownPanel panelTitle={'Address'} isShowing={showUserAdress} 
                        changeVisibility={() => setShowUserAdress(!showUserAdress)}>
                        <button className='flex justify-center bg-white text-black 
                            hover:bg-black border-2 hover:text-white border-black w-full rounded py-1 px-4
                            transition-all duration-150'
                            onClick={() => setShowNewAddress(true)}>
                            {'Add New Address'}
                        </button>
                        {
                            listOfAddress?.map((address) => (
                                <AddressPanel id={address?.id_address} unitNumber={address?.unit_number} 
                                    streetNumber={address?.street_number} postalCode={address?.postal_cod}
                                    addressLine1={address?.address_line1} addressLine2={address?.address_line2}
                                    city={address?.city} country={address?.country} region={address?.region}
                                    updateAddressList={() => fethAddress()} />
                            ))
                        }
                    </DropdownPanel>
                </div>

                {/*Orders Table*/}
                <table className='border-collapse border border-slate-400 shadow p-3 w-full'>
                    <thead>
                        <tr>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Order ID"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Date"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Shipping Method"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"City"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Country"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Region"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Total"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Status"}</th>
                            <th className='bg-slate-200 border border-slate-400 p-2'>{"Info"}</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {
                            listOfOrders.map((order) =>
                            (
                                <tr>
                                    <td className='border border-slate-400 text-center p-2'>{order?.order_id}</td>
                                    <td className='border border-slate-400 text-center p-2'>{String(order?.order_date).substring(0, 10)}</td>
                                    <td className='border border-slate-400 text-center p-2'>{order?.shipping_method}</td>
                                    <td className='border border-slate-400 text-center p-2'>{order?.address?.city}</td>
                                    <td className='border border-slate-400 text-center p-2'>{order?.address?.country}</td>
                                    <td className='border border-slate-400 text-center p-2'>{order?.address?.region}</td>
                                    <td className='border border-slate-400 text-center p-2'>{"$" + order?.order_total}</td>
                                    <td className='border border-slate-400 text-center p-2'>{order?.order_status}</td>
                                    <td className='border border-slate-400 text-center p-2'>
                                        <button className='hover:underline underline-offset-2 text-blue-500' value={order?.order_id}
                                            onClick={(e) => setOrderID(e.target.value)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    orderID != null ?
                    (<OrderModal Title={"Order Info"} 
                        Close={() => setOrderID(null)}
                        OrderID={orderID} />)
                    : null
                }
                
            </div>
        </BaseTemplate>
    );
}

function OrderModal({Close, Title, OrderID}){
    
    const [order, setOrder] = useState(null);

    const fetchOrder = async () => {
        await fetchOrderByID(OrderID)
        .then((res) => setOrder(res.data)).catch((err) => console.log(err));
    }

    useEffect(() =>{
        fetchOrder();
    }, []);
    
    return(
    <TemplateModal Title={Title} Close={Close}>
        <div className='grid grid-cols-2 gap-2'>
            {/*Order ID*/}
            <label className='flex items-center font-bold'>Order ID</label>
            <span>{OrderID}</span>
            {/*Date*/}
            <label className='flex items-center font-bold'>Order ID</label>
            <span>{String(order?.order_date).substring(0, 10)}</span>
            {/*Payment Type*/}
            <label className='flex items-center font-bold'>Payment Type</label>
            <div className='flex flex-row items-center gap-2'>
                {
                    order?.payment_type != null ?
                    order?.payment_type?.toUpperCase() == "PAYPAL" ?
                    (<BsPaypal />) : null
                    : null
                }
                <span>{order?.payment_type}</span>
            </div>
            {/*Address*/}
            <label className='flex items-center font-bold'>Address</label>
            <div className='grid grid-cols-2 gap-2'>
                <label className='flex items-center font-bold'>City</label>
                <span>{order?.address?.city}</span>

                <label className='flex items-center font-bold'>Country</label>
                <span>{order?.address?.country}</span>

                <label className='flex items-center font-bold'>Region</label>
                <span>{order?.address?.region}</span>
            </div>
            {/*Total*/}
            <label className='flex items-center font-bold'>Order Total</label>
            <span>{"$" + order?.order_total}</span>
            {/*Status*/}
            <label className='flex items-center font-bold'>Order Status</label>
            <span>{order?.order_status}</span>
        </div>
    </TemplateModal>
    );
}

function DropdownPanel({ panelTitle, isShowing, changeVisibility, children }){
    return(
        <div className='flex flex-col gap-y-1'>
            <button className='flex items-center justify-between bg-black 
                text-xl text-white text-center w-full rounded p-3'
                onClick={() => changeVisibility()}>
                {panelTitle}
                <BsChevronUp className={`flex transition-transform ${isShowing ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={isShowing ? 'flex flex-col gap-2 bg-white border shadow rounded p-3 w-full' : 'hidden'}>
                {children}
            </div>
        </div>
    );
}

function AddressPanel({ id, unitNumber, streetNumber, postalCode, addressLine1, addressLine2, city, country, region, updateAddressList }){

    const fetchRemoveAddress = async() => {
        updateAddressList();
    }

    return(
        <div key={id} className='flex flex-col bg-black text-white rounded gap-2 p-2'>
            <button className='bg-white text-black hover:bg-black hover:text-white hover:border-white 
                border rounded py-1 px-4 w-full' value={id} onClick={(e) => {console.log(e.target.value); fetchRemoveAddress();} }>
                {'Remove'}
            </button>

            {/*Unit Number*/}
            <div className='flex flex-row gap-x-1'>
                <span className='font-bold'>
                    {'Unit Number:'}
                </span>
                <span>
                    {unitNumber}
                </span>
            </div>

            {/*Street Number*/}
            <div className='flex flex-row gap-x-1'>
                <span className='font-bold'>
                    {'Street Number:'}
                </span>
                <span>
                    {streetNumber}
                </span>
            </div>

            {/*Postal Code*/}
            <div className='flex flex-row gap-x-1'>
                <span className='font-bold'>
                    {'Postal Code:'}
                </span>
                <span>
                    {postalCode}
                </span>
            </div>
            
            {/*Address And Geographic Location*/}
            <div className='flex flex-col sm:flex-row gap-2 w-full'>
                {/*Address Lines*/}
                <div className='grid grid-cols-2 gap-2 bg-white text-black rounded p-2 w-full'>
                    <h2 className='text-center font-bold col-span-2 w-full'>{'Address Lines'}</h2>
                    {/*Line 1*/}
                    <span className='font-bold'>
                        {'Address Line 1:'}
                    </span>
                    <span>
                        {addressLine1}
                    </span>
                    {/*Line 2*/}
                    <span className='font-bold'>
                        {'Address Line 2:'}
                    </span>
                    <span>
                        {addressLine2}
                    </span>
                </div>

                <div className='grid grid-cols-2 gap-2 bg-white text-black rounded p-2 w-full'>
                    <h2 className='text-center font-bold col-span-2 w-full'>{'Geographic Location'}</h2>
                    {/*Country*/}
                    <span className='font-bold'>
                        {'Country:'}
                    </span>
                    <span>
                        {country?.country_name}
                    </span>

                    {/*Region*/}
                    <span className='font-bold'>
                        {'Region:'}
                    </span>
                    <span>
                        {region?.region_name}
                    </span>

                    {/*City*/}
                    <span className='font-bold'>
                        {'City:'}
                    </span>
                    <span>
                        {city?.city_name}
                    </span>
                </div>
            </div>
        </div>
    );
}

function NewAddressForm({ closeForm, updateAddressList}){    
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [selectedRegion, setSelectedRegion] = useState(0);
    const [selectedCity, setSelectedCity] = useState(0);

    const [listOfCountries, setListOfCountries] = useState([]);
    const [listOfRegions, setListOfRegions] = useState([]);
    const [listOfCities, setListOfCities] = useState([]);

    const fetchInsertAddress = async (addressData) => {
        await fetchAddAddress(addressData)
        .then((res) => {
            updateAddressList(); 
            closeForm();
        }).catch((err) => console.log(err));
    }

    const fetchCountries = async () => {
        await fetchAllCountries()
        .then((res) => setListOfCountries(res)).catch((err) => console.log(err));
    }

    const fetchRegions = async () => {
        if(selectedCountry != 0){
            await fetchAllRegionsByCountryID(selectedCountry)
            .then((res) => setListOfRegions(res)).catch((err) => {console.log(err)});
        }else{
            setListOfRegions([])
        }
    }

    const fetchCities = async () => {
        if(selectedRegion != 0){
            await fetchAllCitiesByRegionID(selectedRegion)
            .then((res) => setListOfCities(res)).catch((err) => console.log(err));
        }else{
            setListOfCities([]);
        }
    }

    const handleCountry = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedRegion(0);
        setSelectedCity(0);
    }

    const handleRegion = (e) => {
        setSelectedRegion(e.target.value);
        setSelectedCity(0);
    }

    const handleCity = (e) => {
        setSelectedCity(e.target.value);
    }

    const OnSubmit = handleSubmit((data) => {
        fetchInsertAddress({
            unit_number: data.unit_number,
            street_number: data.street_number,
            address_line1: data.address_line_01,
            address_line2: data.address_line_02,
            postal_code: data.postal_code,
            id_country: selectedCountry,
            id_region: selectedRegion,
            id_city: selectedCity
        });
        
        reset();
        setSelectedCountry(0);
        setSelectedRegion(0);
        setSelectedCity(0);

        closeForm(false);
    })

    useEffect(() => {
        fetchCountries();
        fetchRegions();
        fetchCities();
    }, [selectedCountry, selectedRegion]);
    
    return(
        <div className='fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-20'>
            <form onSubmit={OnSubmit} className='flex flex-col gap-y-3 bg-white rounded border shadow p-2 w-full md:w-1/2 mx-4 md:mx-0'>
                <div className='bg-black rounded w-full p-2'>
                    <h2 className='text-xl text-white text-center w-full'>
                        {'Add New Address'}
                    </h2>
                </div>

                <div className='grid grid-cols-2 gap-2 w-full'>
                    {/*Unit Number Field*/}
                    <div className='grid grid-cols-1 gap-2'>
                        <label htmlFor='txtUnitNumber'>{'Unit Number'}</label>
                        <input type='text' name='txtUnitNumber' 
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600 
                                transition-all duration-150' 
                            {...register('unit_number', {
                                required: {
                                    value: true,
                                    message: 'The unit number is required',
                                },
                                minLength: {
                                    value: 2,
                                    message: 'The unit number required 2 characters at least',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'The unit number can have 20 characters maximum',
                                },
                            })} />
                    </div>

                    {/*Street Number Field*/}
                    <div className='grid grid-cols-1 gap-2'>
                        <label htmlFor='txtStreetNumber'>{'Street Number:'}</label>
                        <input type='text' name='txtStreetNumber' 
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600 
                                transition-all duration-150'
                            {...register('street_number', {
                                required: {
                                    value: true,
                                    message: 'The street number is required'
                                },
                                minLength: {
                                    value: 4,
                                    message: 'The street number required 4 characters at least'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'The street number can have 20 characters maximum'
                                }
                            })} />
                    </div>

                    {/*Address Line 1 Field*/}
                    <div className='grid grid-cols-1 gap-2 col-span-2'>
                        <label>{'Address Line #1'}</label>
                        <input type='text' name='txtAddressLine1' 
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600 
                                transition-all duration-150'
                            {...register('address_line_01', {
                                required: {
                                    value: true,
                                    message: 'The first address line is required'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'The first address line required 5 characters at least'
                                },
                                maxLength: {
                                    value: 45,
                                    message: 'The first address can have 45 characters maximum'
                                }
                            })} />
                    </div>
                    
                    {/*Address Line 2 Field*/}
                    <div className='grid grid-cols-1 gap-2 col-span-2'>
                        <label>{'Address Line #2'}</label>
                        <input type='text' name='txtAddressLine2' 
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600
                                transition-all duration-150'
                            {...register('address_line_02', {
                                required: {
                                    value: true,
                                    message: 'The second address line is required'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'The second address line required 5 characters at least'
                                },
                                maxLength: {
                                    value: 45,
                                    message: 'The second address can have 45 characters maximum'
                                }
                            })} />
                    </div>

                    {/*Postal Code Field*/}
                    <div className='grid grid-cols-1 gap-2'>
                        <label htmlFor='txtPostalCode'>{'Postal Code:'}</label>
                        <input type='text' name='txtPostalCode' 
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600
                                transition-all duration-150'
                            {...register('postal_code',{
                                required: {
                                    value: true,
                                    message: 'The postal code is required'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'The postal code required 5 characters at least'
                                },
                                maxLength: {
                                    value: 8,
                                    message: 'The postal code can have 8 characters maximum'
                                },
                                validate: (value) =>{
                                    return !isNaN(value) || 'The postal code should be made up of numbers';
                                }
                            })} />
                    </div>

                    {/*Country Select Field*/}
                    <div className='grid grid-cols-2 col-span-2'>
                        <label htmlFor='cbxCountry'>{'Country:'}</label>
                        <select name='cbxCountry' 
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600 
                                transition-all duration-150' 
                            value={selectedCountry}
                            onChange={(e) => handleCountry(e)}>
                                <option key={0} value={0}>{'Select'}</option>
                            {
                                listOfCountries?.map((country) => (
                                    <option key={country?.id_country} value={country?.id_country}>{country?.country_name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/*Region Select Field*/}
                    <div className='grid grid-cols-2 col-span-2'>
                        <label htmlFor='cbxRegion'>{'Region:'}</label>
                        <select name='cbxRegion'
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600
                                transition-all duration-150'
                            value={selectedRegion}
                            onChange={(e) => handleRegion(e)}>
                                <option key={0} value={0}>{'Select'}</option>
                            {
                                listOfRegions?.map((region) => (
                                    <option key={region?.id_region} value={region?.id_region}>{region?.region_name}</option>
                                )) 
                            }
                        </select>
                    </div>

                    {/*City Select Field*/}
                    <div className='grid grid-cols-2 col-span-2'>
                        <label htmlFor='cbxCity'>{'City:'}</label>
                        <select name='cbxCity'
                            className='rounded-md p-2 ring-2 hover:ring-4 ring-inset ring-slate-400 hover:ring-slate-600
                                focus:ring-4 focus:ring-slate-600
                                transition-all duration-150' 
                            value={selectedCity}
                            onChange={(e) => handleCity(e)}>
                                <option key={0} value={0}>{'Select'}</option>
                            {
                                listOfCities?.map((city) => (
                                    <option key={city?.id_city} value={city?.id_city}>{city?.city_name}</option>
                                )) 
                            }
                        </select>
                    </div>
                </div>

                <div className='flex flex-row gap-x-2 w-full'>
                    <button className='flex justify-center border-2 border-black bg-black text-white 
                        hover:bg-white hover:text-black rounded py-1 w-full transition duration-100' type='submit'>
                        {'Save Address'}
                    </button>
                    <button className='flex justify-center border-2 border-black bg-black text-white 
                        hover:bg-white hover:text-black rounded py-1 w-full transition duration-100' 
                        onClick={() => {closeForm(false);}}>
                        {'Cancel'}
                    </button>
                </div>
            </form>
        </div>
    );
}