'use client';
import {useEffect, useState} from "react";
import {useDebounceCallback} from "usehooks-ts";
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
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import Link from "next/link";


const Page = () => {
    const [userName, setUserName] = useState('');
    const [userNameMessage, setUserNameMessage] = useState('');
    const [isCheckingUserName, setIsCheckingUserName] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUserName, 500);

    const router = useRouter();

    /**
     * Form handler for the sign up form
     * @param data - The form data
     */
    const form = useForm<z.infer<typeof signUpSchema>>({
        // Use the signUpSchema as the resolver
        resolver: zodResolver(signUpSchema),
        // Initialize the form with default values
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        /**
         * A function to check if the username is unique
         */
        const checkUniqueUserName = async (): Promise<void> => {
            if (userName) {
                try {
                    setIsCheckingUserName(true);
                    setUserNameMessage('');
                    const response = await axios.get(`/api/check-username?username=${userName}`);
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
        checkUniqueUserName();
    }, [userName]);

    /**
     * Handles the on submit event of the form
     * @param data - The form data
     */
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
        <div className={"flex justify-center items-center min-h-screen bg-gray-800"}>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
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
                                                   debounced(e.target.value);
                                                   field.onChange(e)
                                               }}/>
                                    </FormControl>
                                    {isCheckingUserName && <Loader2 className={"animate-spin"}/>}
                                    {userNameMessage && <span
                                        className={`text-sm ${userNameMessage === 'Username is unique' ? 'text-muted-foreground' : 'text-destructive'}`}>{userNameMessage}</span>}
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
                        <Button type={"submit"} disabled={isCheckingUserName || isSubmitting}>
                            {isSubmitting ?
                                <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : "Sign Up"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Page


