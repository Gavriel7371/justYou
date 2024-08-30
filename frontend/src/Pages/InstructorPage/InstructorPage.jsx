import React, { useContext, useState, useEffect, useRef } from 'react';
import { userContext } from '../../App.jsx';
import { useParams } from 'react-router-dom';
import ImageCard from '../../Components/ImagesCard/ImageCard.jsx';
import axios from 'axios';
import './InstructorPage.css';

const expertises = [
  "ספורט כללי", "תזונאי כללי", "ייעוץ כללי",
  "ספורט: מדריך TRX", "ספורט: זומבה", "ספורט: יוגה",
  "ספורט: מאמן חדר כושר", "ספורט: פילאטיס", "תזונאי: רפואי", "תזונאי: תוספים והשלמות מזון", 
  "ייעוץ: מדריך NLP", "ייעוץ: פסיכולוג", "ייעוץ: פסיכולוג ילדים ונוער", "ייעוץ: יועץ זוגי"
];

export default function InstructorPage() {
  const { id } = useParams();
  const [inst, setInst] = useState(null);
  const { user, setUser } = useContext(userContext);
  const [editable, setEditable] = useState(false);
  const [selectedExpertises, setSelectedExpertises] = useState([]);
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [about, setAbout] = useState('');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const updateAbout = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/backend/auth/instructors/about/${id}`, {
        about: about
      });
      setInst(response.data);
    } catch (error) {
      console.error("Failed updating about!", error);
    }
  };

  const updateExperience = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/backend/auth/instructors/experience/${id}`, {
        experience: selectedExpertises
      });
      setInst(response.data);
    } catch (error) {
      console.error("Failed updating experience!", error);
    }
  };

  const handleExpertiseChange = (e) => {
    const value = e.target.value;
    setSelectedExpertises(prev => 
      prev.includes(value) ? prev.filter(ex => ex !== value) : [...prev, value]
    );
  };

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleAddVideo = () => {
    videoInputRef.current.click();
  };

  const handleAddPDF = () => {
    pdfInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file is selected

    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';
    const uploadPreset = import.meta.env.VITE_REACT_APP_UPLOAD_PRESET;
    const cloud_name = import.meta.env.VITE_REACT_APP_CLOUD_NAME; 
    console.log("preset check: " + uploadPreset)
    console.log("link check: " + cloud_name)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      setIsUploading(true);
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/${isVideo ? 'video' : isPDF ? 'raw' : 'image'}/upload`, formData);

      const fileUrl = response.data.secure_url;
      console.log(fileUrl)

      if (isVideo) {
        await axios.patch(`http://localhost:3000/backend/auth/instructors/video/${id}`, {
          userId: id,
          videoUrl: fileUrl
        });

        setInst((prevInst) => ({
          ...prevInst,
          videos: [...(prevInst.videos || []), fileUrl],
        }));

      } else if (isPDF) {
        await axios.patch(`http://localhost:3000/backend/auth/instructors/pdf/${id}`, {
          userId: id,
          pdfUrl: fileUrl
        });

        console.log("isPDF: " + isPDF);

        setInst((prevInst) => ({
          ...prevInst,
          pdfs: [...(prevInst.pdfs || []), fileUrl],
        }));
      } else {
        await axios.patch(`http://localhost:3000/backend/auth/instructors/image/${id}`, {
          userId: id,
          imageUrl: fileUrl
        });

        setInst((prevInst) => ({
          ...prevInst,
          images: [...(prevInst.images || []), fileUrl],
        }));
      }

      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (type, url) => {
    try {
      const endpointMap = {
        image: `http://localhost:3000/backend/auth/instructors/image/${id}`,
        video: `http://localhost:3000/backend/auth/instructors/video/${id}`,
        pdf: `http://localhost:3000/backend/auth/instructors/pdf/${id}`,
      };
  
      await axios.delete(endpointMap[type], { data: { url } });
  
      setInst((prevInst) => {
        const updatedFiles = prevInst[type + 's'].filter((file) => file !== url);
        return {
          ...prevInst,
          [type + 's']: updatedFiles,
        };
      });
    } catch (error) {
      console.log(url);
      console.error(`Failed to delete ${type}!`, error.response || error.message);
    }
  };

  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };

  const toggleEditExpertiseMode = () => {
    setIsEditingExpertise(!isEditingExpertise);
  };

  const toggleEditAboutMode = () => {
    setIsEditingAbout(!isEditingAbout);
  };

  const handleSaveExpertiseChanges = () => {
    updateExperience();
    toggleEditExpertiseMode();
  };

  const handleSaveAboutChanges = () => {
    updateAbout();
    toggleEditAboutMode();
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
  };

  const handleImageClick = (image) => {
    setModalImage(image);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  useEffect(() => {
    axios.get(`http://localhost:3000/backend/auth/instructors/${id}`)
      .then(response => {
        setInst(response.data);
        setAbout(response.data.about || '');
        setSelectedExpertises(response.data.experience || []);
      })
      .catch(error => console.error('Error fetching instructor data:', error));
  }, [id]);

  useEffect(() => {
    if (inst && user) {
      setEditable(inst._id === user._id);
    }
  }, [inst, user]);

  useEffect(() => {
    if (inst && inst.images) {
      setFilteredImages(inst.images.filter(img => img.includes(filter)));
    }
  }, [inst, filter]);

  if (!inst) return <div>טוען</div>;

  return (
    <div className='instructorPage'>
      <div className='profileCard'>
        {inst.avatar ? (
          <img className='avatar' src={inst.avatar} alt={`${inst.name}'s Avatar`} onError={(e) => e.target.style.display = 'none'} />
        ) : (
          <div className='placeholderAvatar'>אין תמונה להצגה</div>
        )}
        <div className='infoBlock'>
          <h1 className='name'>{inst.name}</h1>
        </div>
        <div className={`infoBlock ${editable ? 'editable' : ''}`}>
          <h2 className='infoTitle'>ניסיון</h2>
          <div className='currentExpTags'>
            {selectedExpertises.length > 0 ? selectedExpertises.map((exp, index) => (
              <span key={index} className='expTag'>{exp}</span>
            )) : <p>אין תגיות ניסיון</p>}
          </div>
          {isEditingExpertise ? (
            <div className='editSection'>
              {expertises.map((expertise, index) => (
                <div key={index}>
                  <input
                    type='checkbox'
                    id={`expertise-${index}`}
                    name='expertise'
                    value={expertise}
                    checked={selectedExpertises.includes(expertise)}
                    onChange={handleExpertiseChange}
                  />
                  <label htmlFor={`expertise-${index}`}>{expertise}</label>
                </div>
              ))}
              <br />
              <button className='editButton' onClick={handleSaveExpertiseChanges}>שמור שינויים</button>
            </div>
          ) : (
            <div className='viewSection'>
              {editable && <button className='editButton' onClick={toggleEditExpertiseMode}>עריכה</button>}
            </div>
          )}
        </div>
        <div className={`infoBlock ${editable ? 'editable' : ''}`}>
          <h2 className='infoTitle'>אודות</h2>
          {isEditingAbout ? (
            <div className='editSection'>
              <textarea
                id='aboutTextarea'
                value={about}
                onChange={handleAboutChange}
              />
              <br />
              <button className='editButton' onClick={handleSaveAboutChanges}>שמור שינויים</button>
            </div>
          ) : (
            <div className='viewSection'>
              <p className='infoContent'>{inst.about || 'No information available'}</p>
              {editable && <button className='editButton' onClick={toggleEditAboutMode}>עריכה</button>}
            </div>
          )}
        </div>
        <div className='infoBlock'>
          <h2 className='infoTitle'>פלאפון</h2>
          <p className='infoContent'>{inst.phone}</p>
        </div>
        <div className='infoBlock'>
          <h2 className='infoTitle'>אימייל</h2>
          <p className='infoContent'>{inst.email}</p>
        </div>
        <button className='contactButton' onClick={() => window.location.href = `mailto:${inst.email}`}>שלח אימייל</button>
      </div>
      <div className='profileContent'>
        <div className='gallerySection'>
          <h3>גלריית תמונות</h3>
          <div className='scrollableWrapper'>
            <div className='imageGallery'>
              {filteredImages.length > 0 ? filteredImages.map((image, index) => (
                <div key={index} className='mediaCard'>
                  <ImageCard 
                    image={image} 
                    caption={`Image ${index + 1}`} 
                    onClick={() => handleImageClick(image)}
                  />
                   <button 
                       className='deleteButton' 
                       onClick={() => handleDeleteMedia('image', image)}>
                        מחק
                  </button>
                </div>
              )) : <p>אין תמונות להציג</p>}
            </div>
          </div>
          {editable && (
            <div className='addImageSection'>
              <input
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button className='addButton' onClick={handleAddImage} disabled={isUploading}>הוסף תמונה</button>
              {filePath && <p>Selected file: {filePath}</p>}
              {isUploading && <p>טוען</p>}
            </div>
          )}
        </div>
        <div className='videoSection'>
          <h3>גלריית וידאו</h3>
          <div className='scrollableWrapper'>
            <div className='videoGallery'>
              {inst.videos && inst.videos.length > 0 ? inst.videos.map((video, index) => (
                <div key={index} className='mediaCard'>
                  <video width="320" height="240" controls>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p>סרטון {index + 1}</p>
                    <button 
                      className='deleteButton' 
                      onClick={() => handleDeleteMedia('video', video)}>
                      מחק
                    </button>
                </div>
              )) : <p>אין סרטוני וידאו להציג</p>}
            </div>
          </div>
          {editable && (
            <div className='addVideoSection'>
              <input
                type='file'
                accept='video/*'
                style={{ display: 'none' }}
                ref={videoInputRef}
                onChange={handleFileChange}
              />
              <button className='addButton' onClick={handleAddVideo} disabled={isUploading}>הוסף סרטונים</button>
              {filePath && <p>Selected file: {filePath}</p>}
              {isUploading && <p>טוען</p>}
            </div>
          )}
        </div>
        <div className='pdfSection'>
          <h3>PDF קבצי</h3>
          <div className='pdfGallery'>
            {inst.pdfs && inst.pdfs.length > 0 ? inst.pdfs.map((pdf, index) => (
              <div key={index} className='mediaCard'>
                <a href={pdf} target="_blank" rel="noopener noreferrer">
                  <p>PDF {index + 1}</p>
                </a>
                 <button 
                   className='deleteButton' 
                   onClick={() => handleDeleteMedia('pdf', pdf)}>
                    מחק
                  </button>
              </div>
            )) : <p>אין קבצי PDF</p>}
          </div>
          {editable && (
            <div className='addPDFSection'>
              <input
                type='file'
                accept='application/pdf'
                style={{ display: 'none' }}
                ref={pdfInputRef}
                onChange={handleFileChange}
              />
              <button className='addButton' onClick={handleAddPDF} disabled={isUploading}>הוספת קבצי PDF</button>
              {filePath && <p>Selected file: {filePath}</p>}
              {isUploading && <p>Uploading...</p>}
            </div>
          )}
        </div>
      </div>
      {modalImage && (
        <div className='modal open' onClick={handleCloseModal}>
          <img src={modalImage} alt='Full Size' />
          <button className='modal-close' onClick={handleCloseModal}>✕</button>
        </div>
      )}
    </div>
  );
}
