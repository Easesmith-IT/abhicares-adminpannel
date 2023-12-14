import Wrapper from '../../Wrapper'
import classes from './BookingDetails.module.css'

const BookingDetails = () => {
    return (
        <Wrapper>
            <div className={classes.wrapper}>
                <div className={classes.left_div}>
                    <div className={classes.info}>
                        <div>
                            <h4>seller name</h4>
                            <p>seller phone: 1234567890</p>
                            <select className={classes.select} name="status" id="status">
                                <option value="Pending">Pending</option>
                                <option value="OutOfDelivery">OutOfDelivery</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <p>booking date: 07/12/2023</p>
                            <p>date of appointment: 07/12/2023</p>
                            <p>time of appointment: 12:00</p>
                        </div>
                    </div>
                    <h5 className={classes.heading}>Packages</h5>
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
                        <div className={classes.item}>
                            <div>
                                <img className={classes.img} src="https://dashui.codescandy.com/dashuipro/assets/images/ecommerce/product-2.jpg" alt="product" />
                                <div>
                                    <h6>Product name</h6>
                                    <p>category</p>
                                </div>
                            </div>
                            <p>Qty: 2</p>
                            <p>₹299</p>
                        </div>
                    </div>
                    <h5 className={classes.heading}>Products</h5>
                    <div className={classes.container}>
                        <div className={classes.item}>
                            <div>
                                <img className={classes.img} src="https://dashui.codescandy.com/dashuipro/assets/images/ecommerce/product-2.jpg" alt="product" />
                                <div>
                                    <h6>Product name</h6>
                                    <p>category</p>
                                </div>
                            </div>
                            <p>Qty: 2</p>
                            <p>₹299</p>
                        </div>
                        <div className={classes.item}>
                            <div>
                                <img className={classes.img} src="https://dashui.codescandy.com/dashuipro/assets/images/ecommerce/product-2.jpg" alt="product" />
                                <div>
                                    <h6>Product name</h6>
                                    <p>category</p>
                                </div>
                            </div>
                            <p>Qty: 2</p>
                            <p>₹299</p>
                        </div>
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
                            <p>₹3000</p>
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
                            <p>₹3000</p>
                        </div>
                    </div>
                    <div className={classes.right_div_bottom}>
                        <h5>Customer Details</h5>
                        <div className={classes.d_flex}>
                            <p>Customer Name :</p>
                            <p>World</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Customer Phone :</p>
                            <p>1234567890</p>
                        </div>
                        <div className={classes.d_flex}>
                            <p>Customer Address :</p>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima quisquam totam ea iure suscipit nobis. Dolores adipisci aliquid ipsum in quo nam tempore dolorum? Architecto accusamus corrupti omnis vel modi.</p>
                        </div>

                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default BookingDetails