import classes from './ProductInfoModal.module.css';
import { RxCross2 } from 'react-icons/rx';

const ProductInfoModal = ({ setIsInfoModalOpen }) => {
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
                    <h5>Product Name</h5>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, eaque dolore, adipisci possimus iste debitis quia voluptate nobis laboriosam praesentium nulla minus est quibusdam obcaecati sed alias harum, earum rem?
                    </p>
                    <div>
                        <span>₹1090</span>
                        <span>₹899</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductInfoModal