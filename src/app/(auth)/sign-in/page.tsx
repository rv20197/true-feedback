'use client';
import {useEffect, useOptimistic, useState} from "react";
import {useDebounceValue} from "usehooks-ts";
import {useRouter} from "next/navigation";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signUpSchema} from "@/schemas/signUp.schema";
import z from "zod";
import axios, {AxiosError, AxiosResponse} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";


const Page = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameMessage, setUserNameMessage] = useState('');
    const [isCheckingUserName, setIsCheckingUserName] = useOptimistic(false);
    const [isSubmitting, setIsSubmitting] = useOptimistic(false);
    const [debouncedUserName, setDebouncedUserName] = useDebounceValue(userName, 300);

    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUniqueUserName = async (): Promise<void> => {
            setIsCheckingUserName(true);
            setUserNameMessage('');
            if (debouncedUserName) {
                try {
                    const response = await axios.get(`/api/check-username?username=${debouncedUserName}`);
                    const {message, success} = response.data;
                    if (success) {
                        setUserNameMessage(message);
                    } else {
                        setUserNameMessage('Username is already taken');
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUserNameMessage(axiosError.response?.data.message ?? 'Error checking username');
                    console.error(axiosError.response?.data.message);
                } finally {
                    setIsCheckingUserName(false);
                }
            }
        };
        checkUniqueUserName()
    }, [debouncedUserName]);

    const onSubmitHandler: SubmitHandler<z.infer<typeof signUpSchema>> = async (data): Promise<void> => {
        setIsSubmitting(true);
        try {
            const response: AxiosResponse<ApiResponse> = await axios.post('/api/sign-up', data);
            const {message, success} = response.data;
            if (success) {
                toast.success('Successfully signed up', {
                    description: message,
                    duration: 3000
                });
                router.replace(`/verify/${userName}`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error signing up', {
                description: axiosError.response?.data.message,
                duration: 3000
            });
            console.error(axiosError.response?.data.message ?? 'Error signing up');
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className={"flex justify-center items-center min-h-screen bg-gray-100"}>
            <div className="w-full max-w-8 p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
                    <p className="mb-4">Sign up to start your anonymous chat experience.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="UserName" {...field} type={"text"}
                                               onChange={e => {
                                                   setUserName(e.target.value);
                                                   field.onChange(e)
                                               }}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} type={"email"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} type={"password"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default Page


