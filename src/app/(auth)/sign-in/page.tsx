'use client';
import {useRouter} from "next/navigation";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {signInSchema} from "@/schemas/signIn.schema";
import {signIn} from "next-auth/react";
import {toast} from "sonner";


const Page = () => {
    const router = useRouter();

    /**
     * Form handler for the sign-up form
     * @param data - The form data
     */
    const form = useForm<z.infer<typeof signInSchema>>({
        /**
         * Use the signUpSchema as the resolver
         */
        resolver: zodResolver(signInSchema),
        /**
         * Initialize the form with default values
         */
        defaultValues: {
            email: '',
            password: ''
        }
    });

    /**
     * Handles the on submit event of the form
     * @param data - The form data
     */
    const onSubmitHandler: SubmitHandler<z.infer<typeof signInSchema>> = async (data): Promise<void> => {
        const result = await signIn('credentials', {
            /**
             * The identifier is the email
             */
            identifier: data.email,
            /**
             * The password is the password
             */
            password: data.password,
            /**
             * Do not redirect to the callback URL after signing in
             */
            redirect: false
        });

        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                /**
                 * If the error is "CredentialsSignin", it means the user
                 * entered the wrong email or password
                 */
                toast.error('Login Failed', {
                    description: "Incorrect email or password",
                    duration: 3000
                });
            } else {
                /**
                 * If the error is not "CredentialsSignin", it means there was
                 * an unexpected error
                 */
                toast.error('Error signing in', {
                    description: result.error,
                    duration: 3000
                });
            }
        }
        if (result?.ok && result?.url) {
            /**
             * If the sign in was successful, show a success message and
             * redirect to the dashboard
             */
            toast.success('Successfully signed in', {
                duration: 3000
            });
            router.replace('/dashboard');
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
                        <Button type={"submit"}>
                            Sign In
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Not a member?{' '}
                        <Link href="/sign-up" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Page


