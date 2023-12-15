import axios from 'axios';
import Wrapper from '../../Wrapper'
// import classes from './Bookings.module.css'
import classes from "../Shared.module.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { format } from 'date-fns';

const Bookings = () => {
    const arr = [1, 2, 3, 4, 5];
    const [allOrders, setAllOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const token = localStorage.getItem("adUx");
    const headers = {
        Authorization: token,
    };

    const getAllOrders = async () => {
        try {
            if (!token) {
                navigate("/");
                return;
            }
            const { data } = await axios.get(
                `${process.env.REACT_APP_ADMIN_API_URL}/get-all-orders`,
                { headers }
            );
            console.log('orders', data);
            setAllOrders(data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, [])


    return (
        <>
            <Wrapper>
                <div className={classes["report-container"]}>
                    <div className={classes["report-header"]}>
                        <h1 className={classes["recent-Articles"]}>Bookings</h1>
                    </div>

                    <div className={classes["report-body"]}>
                        <div className={classes["report-topic-heading"]}>
                            <h3 className={classes["t-op"]}>Booking Date</h3>
                            <h3 className={classes["t-op"]}>Product Name</h3>
                            <h3 className={classes["t-op"]}>Seller Name</h3>
                            <h3 className={classes["t-op"]}>Details</h3>
                        </div>

                        <div className={classes.items}>
                            {!isLoading && allOrders?.length === 0 && <p>No orders found</p>}

                            {isLoading && allOrders?.length === 0 && <Loader />}

                            {allOrders?.map((order, i) => (
                                <div key={i} className={`${classes.item1} ${classes.cursor}`}>
                                    <h3 className={classes["t-op-nextlvl"]}>{format(new Date(order.createdAt), "dd-MM-yyyy")}</h3>
                                    <h3 className={classes["t-op-nextlvl"]}>{order.products.map((product)=> product.product.name)}</h3>
                                    <h3 className={classes["t-op-nextlvl"]}>Seller1</h3>
                                    <h3 className={classes["t-op-nextlvl"]}>
                                        <button onClick={() => navigate(`/admin/bookings/${order._id}`, { state: order })} className={classes.button}>View Details</button>
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Wrapper>
        </>
    )
}

export default Bookings