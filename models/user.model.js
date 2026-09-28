import mongoose from "mongoose";
const userSchema = new mongoose.Schema( {
    name: {
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxLength: [50, 'Name must be at most 50 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
//{name: 'John Doe', email: 'john.doe@example.com', password: 'password123'     }
