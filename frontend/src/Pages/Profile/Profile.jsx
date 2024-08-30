import React, { useContext, useState, useEffect, useRef } from 'react';
import { userContext } from '../../App.jsx';
import defaultProfile from '../../../public/defaultProfile.jpg';
import '../Profile/Profile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const isUpdatingAvatar = useRef(false);

  useEffect(() => {
    // Load avatar from localStorage if available and update the user context
    const avatar = localStorage.getItem('avatar');
    if (avatar && (!user || !user.avatar || user.avatar !== avatar)) {
      setUser((prevUser) => {
        if (!prevUser) {
          return { avatar };
        }
        return {
          ...prevUser,
          avatar,
        };
      });
    }
  }, [setUser, user]);

  const moveToManagement = () => {
    navigate("/Management");
  };

  const handleFileChange = async (event) => {
    const uploadPreset = import.meta.env.VITE_REACT_APP_UPLOAD_PRESET;
    const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME; 
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        setIsUploading(true);
        isUpdatingAvatar.current = true;

        // Upload the image to Cloudinary
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData);

        const imageUrl = response.data.secure_url;
        localStorage.setItem('avatar', imageUrl);

        // Update the user's avatar in the backend and context
        await axios.put('http://localhost:3000/backend/auth/profile', {
          userId: user._id,
          avatar: imageUrl,
        });

        setUser((prevUser) => {
          if (!prevUser) {
            return { avatar: imageUrl };
          }
          return {
            ...prevUser,
            avatar: imageUrl,
          };
        });

        setIsUploading(false);
        isUpdatingAvatar.current = false;
      } catch (error) {
        console.error('Error uploading image:', error);
        setIsUploading(false);
        isUpdatingAvatar.current = false;
      }
    }
  };

  if (!user) {
    return <div>טוען</div>;
  }

  return (
    <div className='profileContainer'>
      <div className='profileHeader'>
        <img
          className='userAvatar'
          src={user.avatar || defaultProfile}
          alt="AvatarPic"
          onError={(e) => { e.target.src = defaultProfile; }}
        />
        <input className='uploadInput' type="file" onChange={handleFileChange} />
        {isUploading && <p className='uploadingText'>טוען</p>}
      </div>

      <div className='profileContent'>
        <div className='profileInfo'>
          <h1 className='username'>{user.username}</h1>
          <p className='about'>{user.about}</p>
          <p className='email'>{user.email}</p>
        </div>

        <div className='conZone'>
          <h1>אתרי נוחות וספורט בלחיצה</h1>
         <button onClick={() => { window.location.href = 'https://www.google.co.il/'; }}>גוגל</button>
         <button onClick={() => { window.location.href = 'https://www.ynet.co.il/'; }}>Ynet</button>
         <button onClick={() => { window.location.href = 'https://www.one.co.il/'; }}>ONE</button>
         <button onClick={() => { window.location.href = 'https://www.sport5.co.il/'; }}>ספורט5</button>  
         <button onClick={() => { window.location.href = 'https://sports.walla.co.il/'; }}>וואלה ספורט</button>  
         
        </div>

        <div className='buttonGroup'>
          {user.role === "admin" && (
            <button className='profileButton' onClick={moveToManagement}>
              ניהול מידע ומשתמשים
            </button>
          )}
          {/* Uncomment this section if needed for instructors
          {user.role === "instructor" && (
            <button className='profileButton'>Content Management</button>
          )} */}
        </div>
      </div>
    </div>
  );
}
