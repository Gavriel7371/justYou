import express from 'express'; 
import mongoose from 'mongoose'; 
import dotenv from 'dotenv'; 
import userRouter from './routes/user.route.js'; 
import authRouter from './routes/auth.route.js'; 
import cors from "cors"; // ייבוא ספריית cors להתמודדות עם בעיות קרוס-דומיין
import path from 'path'; // ייבוא ספריית path לניהול נתיבים
import { fileURLToPath } from 'url'; // ייבוא פונקציה לניהול URLים



dotenv.config(); 

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('connected to MongoDB👌');
  })
  .catch((err) => {
    console.log(err); 
  });

const app = express(); 

app.listen(3000, () => {
  console.log('Server running on port 3000!!!👍'); 
});

app.use(express.json()); 
app.use(cors()); 

const __filename = fileURLToPath(import.meta.url); // הגדרת __filename בסביבת ESM
const __dirname = path.dirname(__filename); // הגדרת __dirname בסביבת ESM
// נתיב לקבצים סטטיים
try {
  app.use('/backend/utils/uploads', express.static(path.join(__dirname, 'utils/uploads')));
  console.log('Static files route set successfully'); // הודעה על הגדרת הנתיב בהצלחה
} catch (err) {
  console.error('Error setting static files route:', err); // הודעת שגיאה במידה ולא הצליח להגדיר את הנתיב
}

app.use('/backend/user', userRouter); 
app.use('/backend/auth', authRouter);

// ניהול שגיאות כלליות
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // קביעת קוד סטטוס ברירת מחדל
  const message = err.message || 'Internal Server error'; // קביעת הודעת שגיאה ברירת מחדל
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
