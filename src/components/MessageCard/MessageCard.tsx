'use client';
import {Card, CardHeader, CardTitle,} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import {Message} from "@/models/Message";
import axios from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "sonner";
import {X} from "lucide-react";

type MessageCardProps = {
    message: Message;
    onMessageDeleteHandler: (messageId: string) => void
}

const MessageCard = ({message, onMessageDeleteHandler}: MessageCardProps) => {

    const deleteMessageHandler = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast.success(response.data.message);
        onMessageDeleteHandler(message._id as string);
    }

    return (
        <Card>
            <CardHeader className={'gap-4'}>
                <CardTitle>{message.content} </CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className='w-5 h-5'/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete
                                message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteMessageHandler}>Delete Message</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardHeader>
        </Card>

    )
}
export default MessageCard
