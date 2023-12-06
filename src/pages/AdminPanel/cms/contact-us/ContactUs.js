import classes from '../Cms.module.css'
import ReactQuill from 'react-quill';
import Wrapper from '../../../Wrapper'
import { useState } from 'react';

const ContactUs = () => {
    const [content, setContent] = useState("");

    return (
        <Wrapper>
            <div className={classes.box}>
                <h1>Contact Us</h1>
                <form>
                    <div className={classes.input_container}>
                        <ReactQuill className={classes.react_quill} theme="snow" value={content} onChange={setContent} />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className='btn btn-primary'>Update</button>
                    </div>
                </form>
            </div>
        </Wrapper>
    )
}

export default ContactUs