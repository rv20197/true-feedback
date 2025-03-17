import mongoose,{Schema,Document} from "mongoose";
import {Message, MessageSchema} from "@/models/Message";

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}


export const UserSchema:Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email address"],//[]
    },
    verifyCode: {
        type: String,
        required: [true, "Verification Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification Code Expirt is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
});

const UserModel: mongoose.Model<User> = (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;