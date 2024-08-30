import React, { useContext, useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../App';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { setUser } = useContext(userContext);
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
    const { email, password } = formData;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 'Invalid email format';
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
      const res = await fetch('/backend/auth/signin', {
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
      setUser(data.rest);
      localStorage.setItem('user', JSON.stringify(data.rest));
      localStorage.setItem('token', JSON.stringify(data.token));
      setError(null);
      navigate('/Home');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='signInContainer'>
      <h1 className='signInTitle'>התחברות</h1>
      <form onSubmit={handleSubmit} className='signInForm'>
        <input 
          type="text" 
          placeholder='אימייל' 
          id='email' 
          onChange={handleChange} 
          className='signInInput'
        />
        <input 
          type="password" 
          placeholder='סיסמא' 
          id='password'
          onChange={handleChange}
          className='signInInput'
        />
        <button 
          className='signInButton'
          disabled={loading}
        >
          {loading ? 'טוען...' : 'התחברות'}
        </button>
      </form>
      <div className='signInFooter'>
        <p>אין לך משתמש?  
          <Link to={"/signup"} className='signUpLink'>הירשם </Link>
        </p>
      </div>
      {error && <p className='error'>{error}</p>}
    </div>
  );
}
