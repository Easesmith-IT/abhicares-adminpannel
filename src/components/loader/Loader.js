import classes from './loader.module.css';
import loader from '../../assets/rolling.gif';

const Loader = () => {
  return (
    <div className={classes.img_container}>
        <img src={loader} alt="loader" />
    </div>
  )
}

export default Loader