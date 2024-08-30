import React, { useContext } from 'react';
import { userContext } from '../../App';
import Button from '../../Components/Button';
import './Home.css';

export default function Home() {
    const { user } = useContext(userContext);
    return (
        <div className='homeContainer'>
            <div className='welcomeSection'>
                {/* בדיקה אם המשתמש מחובר לפני הצגת התמונה */}
                {user && user.avatar && (
                    <img className='homeMainImg' src={user.avatar} alt="Welcome" />
                )}
                {!user ? <h2>ברוכים הבאים</h2> : <h2>ברוכים השבים, {user.username}!</h2>}
                <h1 className='actionTitle'>JustYou</h1>
                <h2>It's you, but better</h2>
            </div>

            <div className='section intro'>
                <img className='homeImg'
                    src="https://st5.depositphotos.com/62628780/61998/i/450/depositphotos_619983816-stock-photo-fist-bump-office-teamwork-diversity.jpg"
                    alt="Teamwork" />
                <div className='textContent'>
                    <h2>עלינו בקצרה</h2>
                    <p>
                        ב-JustYou, המשימה שלנו היא להעצים אנשים להגיע לגרסה הטובה ביותר של עצמם באמצעות כלים ומשאבים מותאמים אישית לשיפור עצמי. אנחנו מאמינים ביצירת מרחב שבו תוכלו לחקור, ללמוד ולצמוח בקצב שלכם. הפלטפורמה שלנו מציעה מגוון תכונות שנועדו לתמוך במסע הפיתוח האישי שלכם, ולעזור לכם לקבוע מטרות, לעקוב אחרי ההתקדמות ולחגוג הישגים. הצטרפו אלינו להרפתקה המרגשת הזו לקראת גרסה טובה יותר של עצמכם!
                    </p>
                    <Button className="homeAboutBtn" text={"עלינו"} route={"/About"} />
                </div>
            </div>

            <div className='section intro2'>
                <div className='textContent'>
                    <h2>למה לימוד עצמי?</h2>
                    <p>
                        למידה עצמית היא לא רק שיטה אלא דרך חיים. היא מאפשרת לכם לקחת שליטה על תהליך הלמידה שלכם, לחקור נושאים שמעניינים אתכם באמת ולפתח מיומנויות בקצב שלכם. אימוץ למידה עצמית מטפח חשיבה מתפתחת ומשפר את יכולות פתרון הבעיות שלכם. זהו לא רק גישה מהנה וגמישה, אלא גם כלי רב עוצמה לשיפור עצמי מתמשך. גלו את השמחה שבלמידה ותנו לסקרנות שלכם להוביל את הדרך!
                    </p>
                </div>
                <img className='homeImg'
                    src="https://t4.ftcdn.net/jpg/02/38/76/23/360_F_238762346_xDwNsoK7AmPKB03ZvybZyeZWPGy2sxng.jpg" alt="Goal" />
            </div>

            <div className='section intro3'>
                <img className='homeImg'
                    src="https://assets.entrepreneur.com/content/3x2/2000/1607019411-GettyImages-1188460121.jpg" alt="Motivation" />
                <div className='textContent'>
                    <h2>תגשים את הפוטנציאל שלך!</h2>
                    <p>
                        כל הישג גדול מתחיל בהחלטה לנסות. האמינו ביכולות שלכם ועשו את הצעד הראשון לעבר החלומות שלכם. ב-JustYou, אנו מספקים את הכלים והתמיכה שאתם צריכים כדי לממש את מלוא הפוטנציאל שלכם. זכרו, מסע של אלף מילין מתחיל בצעד אחד. אז תעזו לחלום בגדול, תעבדו קשה, ותהפכו את השאיפות שלכם למציאות. אנחנו כאן כדי לתמוך בכם בכל שלב בדרך!
                    </p>
                </div>
            </div>
        </div>
    );
}
