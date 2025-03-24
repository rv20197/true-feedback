'use client';

import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Message} from "@/models/Message";
import {useSession} from "next-auth/react";
import {acceptMessageSchema} from "@/schemas/acceptMessage.schema";
import * as z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "sonner";
import MessageCard from "@/components/MessageCard/MessageCard";
import {Loader2, RefreshCcw} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Switch} from "@/components/ui/switch";

const Page = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState<string>('');

    const {data: session} = useSession();

    const {watch, register, setValue} = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema)
    });

    const acceptMessages = watch('isAcceptingMessages');

    useEffect(() => {
        if (typeof window !== "undefined") {
            setProfileUrl(`${window.location.origin}/u/${session?.user?.username}`);
        }
    }, [session]);

    const handleDeleteMessage = async (messageId: string) => {
        setMessages((prevMessages) => prevMessages.filter(message => message._id !== messageId));
    };

    const getAcceptMessages = useCallback(async () => {
        try {
            setIsSwitchLoading(true);
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('isAcceptingMessages', response.data.isAcceptingMessages as boolean);
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error('Error', {
                description: axiosError.response?.data.message,
                duration: 3000
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);

    const getAllMessages = useCallback(async (refresh: boolean = false) => {
        try {
            setIsLoading(true);
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages as Message[] || []);
            if (refresh) {
                toast.message('Messages refreshed', {
                    description: "Showing latest messages",
                    duration: 3000
                });
            }
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error('Error', {
                description: axiosError.response?.data.message,
                duration: 3000
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session?.user) {
            getAllMessages();
            getAcceptMessages();
        }
    }, [session, getAcceptMessages, getAllMessages]);

    const handleSwitchChange = async () => {
        try {
            setIsSwitchLoading(true);
            const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages: !acceptMessages});
            setValue('isAcceptingMessages', response.data.isAcceptingMessages as boolean);
            toast.success('Success', {
                description: response.data.message,
                duration: 3000
            });
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error('Error', {
                description: axiosError.response?.data.message,
                duration: 3000
            });
        } finally {
            setIsSwitchLoading(false);
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(profileUrl);
        toast.success('Success', {
            description: "Copied to clipboard",
            duration: 3000
        });
    };

    if (!session?.user) {
        return null;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('isAcceptingMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator/>

            <Button
                className="mt-4"
                variant="outline"
                onClick={() => getAllMessages(true)}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin"/>
                ) : (
                    <RefreshCcw className="h-4 w-4"/>
                )}
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDeleteHandler={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
};

export default Page;
