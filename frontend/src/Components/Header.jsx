import React, { useContext, useState, useEffect } from 'react';
import Button from './Button';
import LogoCircle from '../../public/LogoCircle.jpg';
import { userContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Header.css';

function Header() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  // State for dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for user's preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Apply the dark mode class to the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save user's preference in localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const logoutHandle = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatar');
    navigate("/SignIn");
  };

  const moveToProfilePage = () => {
    navigate("/Profile");
  };

  return (
    <div className='header'>
      <img className='headerLogo' src={LogoCircle} alt="welcomeImg" />
      <h1>JustYou</h1>
      <Button text={"עמוד בית"} route={"/Home"} />
      <Button text={"עלינו"} route={"/About"} />
      <Button text={"צור קשר"} route={"/Contact"} />
      {!user ? (
        <Button text={"התחברות / הרשמה"} route={"/SignIn"} />
      ) : (
        <>
          <Link to={'/Instructors'}>
            <button>מדריכים</button>
          </Link>
          <div className='profileGreeting' onClick={moveToProfilePage}>
            שלום, {user.username}
          </div>
          <button onClick={toggleDarkMode}>
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button className='logoutBtn' onClick={logoutHandle}>התנתק</button>
        </>
      )}
    </div>
  );
}

export default Header;