import classes from './Cms.module.css';
import Wrapper from '../../Wrapper';
import { Link } from 'react-router-dom';

const Cms = () => {
    return (
        <Wrapper>
            <div className={classes.parentContainer}>
                <div className={classes.container}>
                    <Link to="/admin/cms/privacy-policy" className={classes.privacy_policy}>
                        Privacy Policy
                    </Link>
                    <Link to="/admin/cms/about-us" className={classes.about_us}>
                        About Us
                    </Link>
                </div>

                <div className={classes.container}>
                    <Link to="/admin/cms/contact-us" className={classes.contact_us}>
                        Contact Us
                    </Link>
                </div>
            </div>
        </Wrapper>
    )
}

export default Cms