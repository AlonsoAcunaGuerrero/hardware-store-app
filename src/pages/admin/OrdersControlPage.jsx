import { BaseTemplate } from "../Templates";
import { ErrorModal, LoadingModal, SuccessfulModal, TemplateModal, ACTIONS, PROCESS_STATUS } from '../../components/Modal';
import { BsArrowReturnLeft  } from 'react-icons/bs';
import { FaBox, FaCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { PanelButton, PanelActionButton } from "./AdminPage";
import { useEffect, useState } from "react";
import { fetchAdminAllOrders } from "../../services/OrderService";

export default function OrdersControlPage() {
    document.title = 'Admin - Orders Panel';

    const [currentAction, setCurrentAction] = useState(ACTIONS.NONE);

    return(
        <BaseTemplate>
            {
                currentAction == ACTIONS.EDIT ? 
                (<ConfirmOrderModal title={'Confirm Order'} close={() => setCurrentAction(ACTIONS.NONE)} />) :
                null
            }
            <section className='flex flex-1 justify-center'>
                <div className='flex w-[75%]'>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full text-[1.25rem]'>
                        <PanelButton text={'Return'} 
                            url={'./'} >
                                <BsArrowReturnLeft className='flex text-[10em]' />
                        </PanelButton>
                        <PanelActionButton text={'Confirm Order'} color={'bg-lime-300'}
                            action={ACTIONS.EDIT} changeAction={setCurrentAction}>
                            <div className='flex flex-row items-end'>
                                <FaBox className='flex text-[7em] mb-12' />
                                <FaCheckCircle className='flex text-[3em]' />
                            </div>
                        </PanelActionButton>
                        <PanelActionButton text={'Cancel Order'} color={'bg-red-300'}
                            action={ACTIONS.DELETE} changeAction={setCurrentAction}>
                            <div className='flex flex-row items-end'>
                                <FaBox className='flex text-[7em] mb-12' />
                                <FaRegCircleXmark className='flex text-[3em]' />
                            </div>
                        </PanelActionButton>
                    </div>
                </div>
            </section>
        </BaseTemplate>
    )
}

function ConfirmOrderModal({ close, title }){
    return(
        <TemplateModal title={title} close={close}>
            <SearchOrders />
        </TemplateModal>
    )
}

function SearchOrders({ action, buttonStyle }){
    const FILTERS = {
        ID: 0,
        NAME: 1,
    }

    const [currentFilter, setCurrentFilter] = useState(FILTERS.ID);
    const [listOfOrders, setListOfOrders] = useState([]);

    const [currentStatus, setCurrentStatus] = useState(PROCESS_STATUS.NONE);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchProcessingOrders = async () =>{
        await fetchAdminAllOrders()
        .then((res) => {
            setListOfOrders(res);
            setCurrentStatus(PROCESS_STATUS.NONE);
        })
        .catch((err) => {
            let newErrorMsg = `[ERROR ${err?.status}]-${err?.message}`;

            setErrorMsg(newErrorMsg);
            setCurrentStatus(PROCESS_STATUS.ERROR);
        });
    }

    useEffect(() => {
        fetchProcessingOrders();
    }, [])

    return(
        <form className='flex flex-col gap-2'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-row items-center gap-2 w-full'>
                    <label htmlFor="filter">Filter By</label>
                    <select className='border-2 focus:border-slate-800 p-2' name='filter'
                        onChange={(e) => setCurrentFilter(e.target.value)}>
                        <option value={FILTERS.ID}>ID</option>
                        <option value={FILTERS.NAME}>Name</option>
                    </select>
                </div>

                <div className='relative flex overflow-scroll h-[450px] w-full p-1'>
                    {
                        currentStatus == PROCESS_STATUS.LOADING ?
                        <LoadingModal message={'Loading orders...'} /> :
                        currentStatus == PROCESS_STATUS.ERROR ?
                        <ErrorModal message={errorMsg} close={() => setCurrentStatus(PROCESS_STATUS.NONE)} /> :
                        <ul className='flex flex-col h-full w-full p-1 gap-2'>
                            {
                                listOfOrders?.map((order, index) =>
                                <OrderCard index={index} id={order?.id} orderDate={order?.orderDate} />)
                            }
                        </ul>
                    }
                </div>
            </div>
        </form>
    );
}

function OrderCard({index, id, user, orderDate, paymentType, address, shippingMethod, orderTotal, orderStatus}){
    <li key={index} className='flex flex-row rounded border shadow p-2 gap-2 text-[1rem]'>
        {id}
    </li>
}