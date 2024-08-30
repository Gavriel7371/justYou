import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Instructors.css';
import { useNavigate } from 'react-router-dom';

export default function Instructors() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [city, setCity] = useState('');
  const [expertise, setExpertise] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const cities = [
    "עפולה", "אשדוד", "אשקלון", "בת ים", "באר שבע", "אילת",
    "חיפה", "חולון", "הרצליה", "כפר סבא", "קריית אתא", "נתניה",
    "אופקים", "פתח תקווה", "ראשון לציון", "שדרות", "תל אביב"
  ];

  const expertises = [
    "ספורט כללי", "תזונאי כללי", "ייעוץ כללי",
    "ספורט: מדריך TRX", "ספורט: זומבה", "ספורט: יוגה",
    "ספורט: מאמן חדר כושר", "ספורט: פילאטיס", "תזונאי: רפואי", "תזונאי: תוספים והשלמות מזון", 
    "ייעוץ: מדריך NLP", "ייעוץ: פסיכולוג", "ייעוץ: פסיכולוג ילדים ונוער", "ייעוץ: יועץ זוגי"
  ];

  const getAllInstructors = async () => {
    try {
      const res = await axios.get('/backend/auth/instructors');
      setInstructors(res.data);
      setFilteredInstructors(res.data); // Initialize filteredInstructors
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const filterInstructors = () => {
    let filtered = instructors;

    if (city) {
      filtered = filtered.filter(inst => inst.city === city);
    }

    if (expertise) {
      filtered = filtered.filter(inst => {
        return Array.isArray(inst.experience)
          ? inst.experience.includes(expertise)
          : inst.experience?.split(',').map(exp => exp.trim()).includes(expertise);
      });
    }

    setFilteredInstructors(filtered);
  };

  useEffect(() => {
    getAllInstructors();
  }, []);

  useEffect(() => {
    filterInstructors();
  }, [city, expertise, instructors]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const getAvailableCities = () => {
    const availableCities = [...new Set(instructors.map(inst => inst.city))].sort();
    return availableCities;
  };

  const getAvailableExpertises = () => {
    const availableExpertises = [...new Set(instructors.flatMap(inst => {
      return Array.isArray(inst.experience)
        ? inst.experience
        : inst.experience?.split(',').map(exp => exp.trim()) || [];
    }))];
    return availableExpertises;
  };

  return (
    <div className='InstructorContainer'>
      <div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className='searchSelect'
        >
          <option value="">בחר עיר</option>
          {getAvailableCities().map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <button onClick={filterInstructors}>חפש לפי עיר</button>
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className='searchSelect'
        >
          <option value="">בחר תחום ניסיון</option>
          {getAvailableExpertises().map(expertise => (
            <option key={expertise} value={expertise}>{expertise}</option>
          ))}
        </select>
        <button onClick={filterInstructors}>חפש לפי ניסיון</button>
      </div>
      <div className='instTable'>
        <table>
          <thead>
            <tr>
              <th>שם</th>
              <th>ניסיון</th>
              <th>עיר</th>
              <th>פלאפון</th>
              <th>אימייל</th>
              <th>יצירת קשר</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.length > 0 ? filteredInstructors.map((inst) => (
              <tr key={inst._id}>
                <td>{inst.name}</td>
                <td>
                  <div className="experienceTags">
                    {Array.isArray(inst.experience) ? 
                      inst.experience.map((exp, index) => (
                        <span key={index} className="experienceTag">{exp}</span>
                      )) :
                      (typeof inst.experience === 'string' ? 
                        inst.experience.split(',').map((exp, index) => (
                          <span key={index} className="experienceTag">{exp.trim()}</span>
                        )) : 
                        <span>ניסיון לא זמין</span>)
                    }
                  </div>
                </td>
                <td>{inst.city}</td>
                <td>{inst.phone}</td>
                <td>{inst.email}</td>
                <td>
                  <button onClick={() => { window.location.href = `mailto:${inst.email}`; }}>שלח אימייל</button>
                  <button onClick={() => { navigate('./' + inst._id); }}>פרופיל המדריך</button>
                </td>
              </tr>
            )) : <tr><td colSpan="6"><h4>אין מדריכים רשומים</h4></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
