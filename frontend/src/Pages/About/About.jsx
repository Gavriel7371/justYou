import React, { useState, useEffect } from 'react';
import './About.css';

export default function About() {
  // State to manage dark mode
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem('darkMode')) || false
  );

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className={`aboutContainer ${darkMode ? 'dark-mode' : ''}`}>
      <div className='introSection'>
        <h2 className='actionTitle'>עלינו</h2>
        <div className='underline'></div>
        <p className='introText'>
          ברוכים הבאים ל-JustYou! הפלטפורמה שלנו מוקדשת לעזור לכם להשיג את מטרות הפיתוח האישי שלכם באמצעות כלים ומשאבים חדשניים. אנו נלהבים ליצור מרחב שבו תוכלו לחקור, ללמוד, ולצמוח. תנו לנו לקחת אתכם למסע של שיפור עצמי וגילוי!
        </p>
      </div>

      <div className='section aboutUs'>
        <img className='aboutImg' src="https://t4.ftcdn.net/jpg/02/38/76/23/360_F_238762346_xDwNsoK7AmPKB03ZvybZyeZWPGy2sxng.jpg" alt="Our Vision" />
        <div className='textContent'>
          <h3>אז ככה...</h3>
          <p>
            החזון שלנו ב-JustYou הוא לספק פלטפורמה ייחודית שבה שיפור עצמי הוא לא רק נגיש, אלא גם מהנה. התחלנו עם רעיון פשוט: ליצור מרחב שבו תוכלו למצוא את הכלים והמשאבים שאתם צריכים כדי להתפתח כאנשים. מההתחלות הצנועות שלנו ועד למקום שבו אנחנו נמצאים היום, המשימה שלנו תמיד הייתה להשריש ולהעניק תמיכה במסע שלכם לצמיחה אישית.
          </p>
        </div>
      </div>

      <div className='floatingEffect'>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
