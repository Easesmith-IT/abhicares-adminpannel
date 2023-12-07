import Wrapper from '../../Wrapper'
// import classes from './Bookings.module.css'
import classes from "../Shared.module.css";
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
    const arr = [1, 2, 3, 4, 5];
    const navigate = useNavigate();

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
                            {arr?.map(() => (
                                <div className={`${classes.item1} ${classes.cursor}`}>
                                    <h3 className={classes["t-op-nextlvl"]}>07/12/2023</h3>
                                    <h3 className={classes["t-op-nextlvl"]}>Product1</h3>
                                    <h3 className={classes["t-op-nextlvl"]}>Seller1</h3>
                                    <h3 className={classes["t-op-nextlvl"]}>
                                        <button onClick={() => navigate("/admin/bookings/123")} className={classes.button}>View Details</button>
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