import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <div className='contactContainer'>
      <div className='contactPageBody'>
        <h2 className='contactTitle'>פרטי יצירת קשר</h2>
        <div className='underline'></div>
        <div className='contactContent'>
          <h3 className='contactSubtitle'>נשמח אם תיצרו איתנו קשר</h3>
          <p className='contactDescription'>
          לכל שאלה, טענה, בעיה או בקשה נשמח אם תיצרו קשר עימנו <br />
          *מעוניינים להירשם כמדריכים אנא צרו קשר*
          </p>
          <div className='contactDetails'>
            <div className='contactItem'>
              <h4>📞 וואטסאפ 📞</h4>
              <p>052-531-7799 - שי</p>
              <p>053-340-9775 - גבריאל</p>
              <h4>📧</h4>
            </div>
            <div className='contactItem'>
              
              <button className='contactButton' onClick={() => { window.location.href = "mailto:JustYouProj@gmail.com"; }}>
                שלח אימייל
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
