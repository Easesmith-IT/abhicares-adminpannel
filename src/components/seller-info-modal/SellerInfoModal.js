import classes from './SellerInfoModal.module.css';
import { RxCross2 } from 'react-icons/rx';
import parse from 'html-react-parser';

const SellerInfoModal = ({ setIsSellerInfoModalOpen, seller }) => {
    console.log(seller);
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>Professional Info</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsSellerInfoModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <div className={classes.contianer}>
                    <h5>name: {seller?.name}</h5>
                    <p>gst number: {seller.gstNumber}</p>
                    <p>phone: {seller.phone}</p>
                    <p>legal name: {seller.legalName}</p>
                    <p>status: {seller.status? "Active":"InActive"}</p>
                    <p>address: {`${seller.address.addressLine}, ${seller.address.city}, ${seller.address.state}, ${seller.address.pincode}`}</p>
                    <p className={classes.mt}>contact person email: {seller.contactPerson.email}</p>
                    <p>contact person name: {seller.contactPerson.name}</p>
                    <p>contact person phone: {seller.contactPerson.phone}</p>
                </div>
            </div>
        </div>
    )
}

export default SellerInfoModal