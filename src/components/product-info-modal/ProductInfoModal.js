import classes from './ProductInfoModal.module.css';
import { RxCross2 } from 'react-icons/rx';
import parse from 'html-react-parser';

const ProductInfoModal = ({ setIsInfoModalOpen,product }) => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>Product Info</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsInfoModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <div className={classes.contianer}>
                    <h5>{product?.name}</h5>
                    <p>{parse(product.description)}</p>
                    <div>
                        <span>₹{product.price}</span>
                        <span>₹{product.offerPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductInfoModal