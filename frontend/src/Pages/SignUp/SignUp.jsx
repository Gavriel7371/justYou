import React, { useState } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  ///
  const validateForm = (formData) => {
    const { email, phone, password } = formData;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 'Invalid email format';
    }
    if (!/^\d{10}$/.test(phone)) {
      return 'Phone number must be 10 digits';
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
      return 'Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a number';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm(formData);
    if (error) {
      setError(error);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const cities = [
    "עפולה", "אשדוד", "אשקלון", "בת ים", "באר שבע", "אילת",
    "חיפה", "חולון", "הרצליה", "כפר סבא", "קריית אתא", "נתניה",
    "אופקים", "פתח תקווה", "ראשון לציון", "שדרות", "תל אביב"
  ];

  return (
    <div className='signUpContainer'>
      <h1 className='signUpTitle'>יצירת משתמש</h1>
      <form onSubmit={handleSubmit} className='signUpForm'>
        <input 
          type="text" 
          placeholder='שם מלא - אופציונאלי' 
          id='name' 
          onChange={handleChange} 
          className='signUpInput'
        />
        <select 
          id='city' 
          onChange={handleChange} 
          className='signUpInput'
          defaultValue=""
        >
          <option value="" disabled>בחר עיר</option>
          {cities.sort().map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder='שם משתמש' 
          id='username' 
          onChange={handleChange} 
          className='signUpInput'
        />
        <input 
          type="text" 
          placeholder='אימייל' 
          id='email' 
          onChange={handleChange} 
          className='signUpInput'
        />
        <input 
          type="tel" 
          placeholder='פלאפון' 
          id='phone' 
          onChange={handleChange} 
          className='signUpInput'
        />
        <input 
          type="password" 
          placeholder='סיסמא' 
          id='password' 
          onChange={handleChange} 
          className='signUpInput'
        />
        <textarea 
          placeholder='אודות' 
          id='about' 
          onChange={handleChange} 
          className='signUpTextarea'
        />
        <button 
          className='signUpButton'
          disabled={loading}
        >
          {loading ? 'טוען...' : 'הירשם'}
        </button>
      </form>
      <div className='signUpFooter'>
        <p>כבר יש לך משתמש? 
          <Link to={"/signin"} className='signInLink'>התחבר</Link>
        </p>
      </div>
      {error && <p className='error'>{error}</p>}
    </div>
  );
}
