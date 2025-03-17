import {Message} from  "@/models/Message";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Message[]
}