import { useState } from 'react'
import Wrapper from '../../Wrapper'
import classes from './BookingDetails.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const BookingDetails = () => {
    const { state } = useLocation();
    console.log(state);

    const navigate = useNavigate();
    const [status, setStatus] = useState(state?.status);

    const token = localStorage.getItem("adUx");
    const headers = {
        Authorization: token,
    };

    const handleChange = async (e) => {
        setStatus(e.target.value);
        try {
            if (!token) {
                navigate("/");
                return;
            }
            const { data } = await axios.post(
                `${process.env.REACT_APP_ADMIN_API_URL}/change-order-status/${state._id}`, { status: e.target.value }, { headers }
            );
            console.log('status', data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Wrapper>
            <div className={classes.wrapper}>
                <div className={classes.left_div}>
                    <div className={classes.info}>
                        <div>
                            <h4>seller name</h4>
                            <p>seller phone: 1234567890</p>
                            <select onChange={handleChange} value={status} className={classes.select} name="status" id="status">
                                <option value="Pending">Pending</option>
                                <option value="OutOfDelivery">OutOfDelivery</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <p>booking date: {format(new Date(state.createdAt), "dd-MM-yyyy")}</p>
                            <p>date of appointment: 07/12/2023</p>
                            <p>time of appointment: 12:00</p>
                        </div>
                    </div>
                    {/* <h5 className={classes.heading}>Packages</h5>
                    <div className={classes.container}>
                        <div className={classes.item}>
                            <div>
                                <img className={classes.img} src="https://dashui.codescandy.com/dashuipro/assets/images/ecommerce/product-2.jpg" alt="product" />
                                <div>
                                    <h6>package name</h6>
                                    <p>category</p>
                                </div>
                            </div>
                            <p>Qty: 2</p>
                            <p>₹299</p>
                        </div>
                    </div> */}
                    <h5 className={classes.heading}>Products</h5>
                    <div className={classes.container}>
                        {state.products?.map((product) => (
                            <div key={product.product._id} className={classes.item}>
                                <div>
                                    <img className={classes.img} src="https://dashui.codescandy.com/dashuipro/assets/images/ecommerce/product-2.jpg" alt="product" />
                                    <div>
                                        <h6>{product.product.name}</h6>
                                        <p>category</p>
                                    </div>
                                </div>
                                <p>Qty: {product.quantity}</p>
                                <p>₹{product.product.offerPrice * product.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={classes.right_div}>
                    <div className={classes.right_div_top}>
                        <h5>Booking Summary</h5>
                        <div className={classes.heading}>
                            <p>Descriptions</p>
                            <p>Amounts</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Sub Total :</p>
                            <p>₹{state.orderValue}</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Tax :</p>
                            <p>₹{(Number(state.orderValue) * 18) / 100}</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Discount :</p>
                            <p>₹300</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Shipping Charge :</p>
                            <p>₹300</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Total Amount :</p>
                            <p>₹{(Number(state.orderValue) * 18) / 100 + Number(state.orderValue)}</p>
                        </div>
                    </div>
                    <div className={classes.right_div_bottom}>
                        <h5>Customer Details</h5>
                        <div className={classes.d_flex}>
                            <p>Customer Name :</p>
                            <p>{state.user.name}</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Customer Phone :</p>
                            <p>{state.user.phone}</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Customer Address :</p>
                            <p>{`${state.user.address.addressLine},${state.user.address.landmark},${state.user.address.pincode}`}</p>
                        </div>

                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default BookingDetails