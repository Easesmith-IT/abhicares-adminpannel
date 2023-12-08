import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Wrapper from '../../../Wrapper'
import ReactQuill from 'react-quill';
import classes from '../Cms.module.css';

const PrivacyPolicy = () => {
    const [content, setContent] = useState("");

      useEffect(() => {
        const getAboutUsContent = async () => {
          try {
            const response = await axios.get(
              "http://localhost:5000/api/content/get-content",
              {
                params: {
                  type: "privacypolicy-content",
                  page: "privacypolicy",
                  section: "privacy-policy",
                },
              }
            );

            console.log(response);
            setContent(response.data.content);
          } catch (err) {}
        };

        getAboutUsContent();
      }, []);

      const updateContent = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(
            "http://localhost:5000/api/content/update-content",
            {
              type: "privacypolicy-content",
              page: "privacypolicy",
              section: "privacy-policy",
              content: "",
            }
          );

          console.log(response);
          if (response.status === 200) {
            alert("Updated successfully!");
          }
        } catch (err) {
          console.log(err);
        }
      };

    

    return (
        <Wrapper>
            <div className={classes.box}>
                <h1>Privacy Policy</h1>
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

export default PrivacyPolicy