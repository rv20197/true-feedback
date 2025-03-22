'use client';
import {useParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {verifySchema} from "@/schemas/verify.schema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "sonner";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

/**
 * Page to verify the user account with the verification code sent to the user's email.
 * @returns {JSX.Element}
 * @constructor
 */
const Page = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Form handler for the verify form
     * @type {UseFormProps<z.infer<typeof verifySchema>>}
     */
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifyCode: ""
        }
    });

    /**
     * Handles the on submit event of the form
     * @param data - The form data
     */
    const onSubmitHandler = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.verifyCode
            });
            const {message, success} = response.data;
            if (success) {
                toast.success('Successfully verified', {
                    description: message,
                    duration: 3000
                });
                router.replace('/sign-in');
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error verifying user, please try again later', {
                description: axiosError.response?.data.message,
                duration: 3000
            });
            console.error(axiosError.response?.data.message ?? 'Error verifying user, please try again later');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={'flex justify-center items-center min-h-screen bg-gray-800'}>
            <div className={'w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'}>
                <div className="text-center">
                    <h1 className="text-4xl font extrabold tracking-tight lg:text-5xl mb-6">Verify your Account</h1>
                    <p className="mb-4">Enter the verification code sent to your email.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="verifyCode"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Verification Code" {...field} type={'number'}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default Page
