import unapprovedSellerModalClasses from './UnapprovedSellerModal.module.css';
import classes from '../../pages/AdminPanel/Shared.module.css';
import { RxCross2 } from 'react-icons/rx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UnapprovedSellerModal = ({ setIsUnapprovedSellerModalOpen }) => {
    const [allSellers, setAllSellers] = useState([]);
    const navigate = useNavigate()

    const token = localStorage.getItem("adUx")
    const headers = {
        Authorization: token
    }

    const getAllSellers = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/in-review-seller`, { headers });
            console.log("appppp",data);
            setAllSellers(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnChange = async (id) => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-seller-status/${id}`, { status: "active" }, { headers });
            console.log(data);
            toast.success("Seller approved");
            getAllSellers();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllSellers();
    }, [])

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
                                    {seller.status === "in-review" ?
                                        <button onClick={() => handleOnChange(seller._id)} className={unapprovedSellerModalClasses.button}>Approve</button>
                                        : <p>Approved</p>
                                    }
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