'use client';
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";
import {User} from 'next-auth';
import {Button} from "@/components/ui/button";
import {Fragment} from "react";
import {useRouter} from "next/navigation";

/**
 * The Navbar component is a Next.js component that renders a navigation bar
 * with a sign in or sign out button depending on the user's authentication
 * state.
 *
 * @returns A JSX element representing the Navbar component.
 */
const Navbar = () => {
    /**
     * The user's session, if any.
     */
    const {data: session} = useSession();
    /**
     * The user, if any.
     */
    const user: User = session?.user as User;

    const router = useRouter();

    const signOutHandler = async () => {
        await signOut();
    }

    return (
        <nav className={'p-4 md:p-6 flex justify-between shadow-md'}>
            <div className={'container mx-auto flex justify-between items-center gap-4 flex-col md:flex-row'}>
                <Link href={"#"} className={'text-xl font-bold md:mb-0'}>Mystery Message</Link>
                {session ? (
                    <Fragment>
                        <span className={'mr-4'}>Welcome, {user?.username}</span>
                        <Button className='w-full md:w-auto' onClick={signOutHandler}>Sign Out</Button>
                    </Fragment>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button className='w-full md:w-auto'>
                            Sign In
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}
export default Navbar
