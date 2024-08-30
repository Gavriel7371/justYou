import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs'; 
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// sign-up
export const signup = async (req, res, next) => {
    const { name, username, city, email, phone, password, about } = req.body;

    // אימות באמצעות ריג'קס
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return next(errorHandler(400, 'Invalid email format'));
    if (!/^\d{10}$/.test(phone)) return next(errorHandler(400, 'A valid Israeli phone number required'));
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) return next(errorHandler(400, 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number'));

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ name, username, city, email, phone, password: hashedPassword, about });

    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
    }
};
// sign-in
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    // אימות באמצעות ריג'קס
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return next(errorHandler(400, 'Invalid email format'));

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).send({ token, rest });
    } catch (error) {
        next(error);
    }
};

export const getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: "instructor" });
        res.status(200).send(instructors);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};
export const getAllInstructorsByCity = async (req, res) => {
    try {
        const instructors = await User.find({ city: "instructor" });
        res.status(200).send(instructors);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};
export const getAllInstructorsByExperty = async (req, res) => {
    try {
        const instructors = await User.find({ Experience: "instructor" });
        res.status(200).send(instructors);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};

export const getSingleInstructors = async (req, res) => {
    try {
        const instructor = await User.findById(req.params.id);
        res.status(200).send(instructor);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.params.id });
        res.status(204).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};

export const changeRole = async (req, res) => {
    try {
        const newRole = req.body.roletxt;
        if (newRole === "admin" || newRole === "user" || newRole === "instructor") {
            await User.updateOne({ _id: req.params.id }, { role: newRole });
            res.status(204).send("User role changed");
        } else {
            console.log("Invalid role");
            res.status(400).send("Invalid role");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};

//*
export const changeProfile = async (req, res, next) => {
    try {
      console.log('File received:', req.file); // הדפסת מידע על הקובץ שהתקבל לקונסול
  
      const filePath = `backend/utils/uploads/${req.file.filename}`; // יצירת נתיב הקובץ
      const userId = req.body.userId; // קבלת Id
      await User.updateOne({ _id: userId }, { avatar: filePath }); // עדכון נתיב התמונה בנתוני המשתמש במסד הנתונים
  
      res.status(200).json({ url: `http://localhost:3000/${filePath}` }); // החזרת נתיב התמונה המלא בתגובה
    } catch (error) {
      console.error('Error in changeProfile:', error); // הדפסת הודעת שגיאה לקונסול
      next(error); 
    }
  };
  
export const updateAbout = async (req, res) => {
    const { id } = req.params;
    const { about } = req.body;

try {
  const updatedInstructor = await User.findOneAndUpdate(
    { _id: id },
    { about: about },
    { new: true, runValidators: true }
  );

  if (!updatedInstructor) {
    return res.status(404).json({ message: 'Instructor not found' });
  }

  res.status(200).json(updatedInstructor);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}

}

export const updateExperience = async (req, res) => {
    console.log("reached backend")
    const { id } = req.params;
const { experience } = req.body;
console.log(id);
console.log(experience);

try {
  const updatedInstructor = await User.findOneAndUpdate(
    { _id: id },
    { experience: experience },
    { new: true, runValidators: true }
    
  );

  if (!updatedInstructor) {
    return res.status(404).json({ message: 'Instructor not found' });
  }

  res.status(200).json(updatedInstructor);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}

}

export const updateProfile = async (req, res) => {
  try {
    const { userId, avatar } = req.body;
    console.log('Received userId:', userId);
    console.log('Received avatar:', avatar);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.avatar = avatar;
    await user.save();
    res.send({ url: avatar });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal server error');
  }
};

export const addImage = async (req, res) => {
    try {
      const { userId, imageUrl } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      user.images.push(imageUrl);
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error('Error adding image:', error);
      res.status(500).send('Internal server error');
    }
  };

  export const addVideo = async (req, res) => {
    console.log("uploading video")
    try {
      console.log("uploading video")
      const { userId, videoUrl } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      user.videos.push(videoUrl);
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error('Error adding video:', error);
      res.status(500).send('Internal server error');
    }
  };

  export const addPDF = async (req, res) => {
    try {
      const { userId, pdfUrl } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      user.pdfs.push(pdfUrl);
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error('Error adding PDF file:', error);
      res.status(500).send('Internal server error');
    }
  };

  export const deleteImage  =  async (req, res) => {
    console.log("Reached backend")
    const { id } = req.params;
    const { url } = req.body;
  
    try {
      // Ensure your Instructor model and update logic are correct
      await User.updateOne({ _id: id }, { $pull: { images: url } });
      res.status(200).send('Image deleted');
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).send('Failed to delete image');
    }
  }

  export const deleteVideo  =  async (req, res) => {
    console.log("Reached backend")
    const { id } = req.params;
    const { url } = req.body;
  
    try {
      // Ensure your Instructor model and update logic are correct
      await User.updateOne({ _id: id }, { $pull: { videos: url } });
      res.status(200).send('Video deleted');
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).send('Failed to delete video');
    }
  }

  export const deletePDF  =  async (req, res) => {
    console.log("Reached backend")
    const { id } = req.params;
    const { url } = req.body;
  
    try {
      // Ensure your Instructor model and update logic are correct
      await User.updateOne({ _id: id }, { $pull: { pdfs: url } });
      res.status(200).send('Image pdf');
    } catch (error) {
      console.error('Error deleting pdf:', error);
      res.status(500).send('Failed to delete pdf');
    }
  }