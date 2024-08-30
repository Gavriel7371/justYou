import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "None"
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ["user", "instructor", "admin"],
        default: "user",
    },
    phone: {
        type: String,
        unique: true,
        default: "None"
    },
    about: {
        type: String,
        default: "None"
    },
    city: {
        type: String,
        default: "General"
    },
    experience: {
        type: [String],
        default: []
    },
    images: {
         type: [String],
          default: []
    }, 
    videos: {
         type: [String],
          default: []
    },
    pdfs: {
         type: [String],
         default: [] 
    }
    
}, 
{timestamps: true}); // זמן יצירה

const User = mongoose.model('User', userSchema);

export default User;

