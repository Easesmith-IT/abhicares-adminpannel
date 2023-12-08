import axios from 'axios';
import classes from '../Cms.module.css'
import ReactQuill from 'react-quill';
import Wrapper from '../../../Wrapper';
import { useEffect, useState } from 'react';



const AboutUs = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        const getAboutUsContent = async () => {
          try {
            const response = await axios.get(
              "http://localhost:5000/api/content/get-content",
              {
                params: {
                  type: "about-content",
                  page: "aboutus",
                  section: "about-us",
                },
              }
            );

              console.log(response)
              setContent(response.data.content)
          } catch (err) {}
        };

        getAboutUsContent()
    }, []);

    const updateContent = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post(
            "http://localhost:5000/api/content/update-content",
            {
              type: "about-content",
              page: "aboutus",
                section: "about-us",
                content:content
            }
            );
            
            console.log(response)
            if (response.status === 200) {
                alert('Updated successfully!')
            }
        } catch (err) {
            console.log(err)
        }
    }

    

    return (
      <Wrapper>
        <div className={classes.box}>
          <h1>About Us</h1>

          <form>
            <div className={classes.input_container}>
              <ReactQuill
                className={classes.react_quill}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
            <div className={classes.button_wrapper}>
              <button className="btn btn-primary" onClick={updateContent}>
                Update
              </button>
            </div>
          </form>
        </div>
      </Wrapper>
    );
}

export default AboutUs