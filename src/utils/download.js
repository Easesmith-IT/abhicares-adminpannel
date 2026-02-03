import axios from 'axios';
import { saveAs } from 'file-saver';

export const saveDoc = (preSignedUrl)=>{
    try {
        (async () => {
            const { data } = await axios.get(preSignedUrl, {
                responseType: 'blob',
            });
            saveAs(data,"document.pdf");
        })()
    } catch (error) {
        console.error('Error downloading PDF:', error);
    }
}