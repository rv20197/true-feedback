import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const MessageModel: mongoose.Model<Message> = (mongoose.models.Message as mongoose.Model<Message>) ||
    mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;