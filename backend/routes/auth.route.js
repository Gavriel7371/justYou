import express from 'express';
import {
  signin,
  signup,
  getAllInstructors,
  getAllUsers,
  deleteUser,
  changeRole,
  changeProfile,
  getSingleInstructors,
  getAllInstructorsByCity,
  getAllInstructorsByExperty,
  updateAbout,
  updateExperience,
  updateProfile,
  addImage,
  addVideo,
  addPDF,
  deleteImage,
  deleteVideo,
  deletePDF,
} from '../controller/auth.controller.js';
import upload from '../utils/uploads/multerConfig.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

// Use query parameters for filtering instructors
router.get("/instructors", getAllInstructors);
router.get("/instructors/city/:city", getAllInstructorsByCity);
router.get("/instructors/experty/:experty", getAllInstructorsByExperty);

// Use distinct paths for PATCH requests
router.patch("/instructors/about/:id", updateAbout);
router.patch("/instructors/experience/:id", updateExperience);
router.patch("/instructors/image/:id", addImage);
router.patch("/instructors/video/:id", addVideo);
router.patch("/instructors/pdf/:id", addPDF);

// DELETE request for deleting an image
router.delete('/instructors/image/:id', deleteImage);
router.delete('/instructors/video/:id', deleteVideo);
router.delete('/instructors/pdf/:id', deletePDF);

router.put('/profile', updateProfile);

router.get("/Management", getAllUsers);
router.delete("/Management/:id", deleteUser);
router.put("/Management/:id", changeRole);

router.put("/Profile", upload.single("profilePic"), changeProfile);
router.get("/instructors/:id", getSingleInstructors);

export default router;
