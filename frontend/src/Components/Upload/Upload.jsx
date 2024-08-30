import React, { useState } from 'react'
import axios from 'axios';

const Upload = () => {

    const [img,setImg] = useState(null);
    const [Loading, setLoading] = useState(false);

    const uploadFile= async(img)  => {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "images_preset")

        try {
            let cloudName = proccess.env.CLOUD_NAME;
            let resourceType = 'image';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}$/${resourceType}$/upload`

            const res = await axios.post(api, data);
            const {secure_url} = res.data;
            console.log(secure_url);
            return secure_url;
        
        } catch (error) {
            
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const imgUrl = await uploadFile('image');
           // await axios.post(`${proccess.env.}`,{imgUrl});
            
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <form>
      <div>
        <input type="file" accept='image/*' id="img" onChange={(e)=> setImg((prev) => e.target.files[0])}/>
      </div><br />
      <button type='submit'>Change profile</button>
    </form>
  )
}

export default Upload
