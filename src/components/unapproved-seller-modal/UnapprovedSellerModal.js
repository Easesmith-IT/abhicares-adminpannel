import unapprovedSellerModalClasses from './UnapprovedSellerModal.module.css';
import classes from '../../pages/AdminPanel/Shared.module.css';
import { RxCross2 } from 'react-icons/rx';

const UnapprovedSellerModal = ({ setIsUnapprovedSellerModalOpen, allSellers }) => {
    return (
        <div className={unapprovedSellerModalClasses.wrapper}>
            <div className={unapprovedSellerModalClasses.modal}>
                <div className={unapprovedSellerModalClasses.heading_container}>
                    <h4>Unapproved Seller</h4>
                    <div className={unapprovedSellerModalClasses.d_flex}>
                        <RxCross2 onClick={() => setIsUnapprovedSellerModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <div className={classes["report-body"]}>
                    <div className={classes["report-topic-heading"]}>
                        <h3 className={classes["t-op"]}>Seller Name</h3>
                        <h3 className={classes["t-op"]}>Service</h3>
                        <h3 className={classes["t-op"]}>Category</h3>
                        <h3 className={classes["t-op"]}>Phone</h3>
                        <h3 className={classes["t-op"]}>Approve</h3>
                    </div>

                    <div className={classes.items}>
                        {allSellers?.map((seller) => (
                            <div key={seller._id} className={classes.item1}>
                                <h3 className={classes["t-op-nextlvl"]}>{seller.name}</h3>
                                <h3 className={`${classes["t-op-nextlvl"]}`}>service</h3>
                                <h3 className={`${classes["t-op-nextlvl"]}`}>category</h3>
                                <h3 className={`${classes["t-op-nextlvl"]}`}>{seller.phone}</h3>
                                <h3 className={`${classes["t-op-nextlvl"]}`}>
                                    <button className={unapprovedSellerModalClasses.button}>Approve</button>
                                </h3>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnapprovedSellerModal