import classes from './ProductInfoModal.module.css';
import { RxCross2 } from 'react-icons/rx';
import parse from 'html-react-parser';

const ProductInfoModal = ({ setIsInfoModalOpen, product, isPackage }) => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                {/* <Carousel responsive={responsive} arrows={false} showDots className={classes.carousel} customButtonGroup={<ButtonGroup />} >
                    {product?.imageUrl?.map((image) => (
                        <img key={image} className={classes.carousel_img} src={`${process.env.REACT_APP_DOMAIN}/uploads/${image}`} alt="" />
                    ))}
                </Carousel> */}
                <div className={classes.heading_container}>
                    <h4>{isPackage ? "Package" : "Product"} Info</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsInfoModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <div className={classes.contianer}>
                    <h5>{product?.name}</h5>
                    {product?.description && <p>{parse(product?.description)}</p>}
                    <div>
                        <span>₹{product?.price}</span>
                        <span>₹{product?.offerPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductInfoModal