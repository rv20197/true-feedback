'use client';
import {signIn, signOut, useSession} from "next-auth/react"

/**
 * This component will render a "Sign in" or "Sign out" button based on the user's session state.
 * If the user is signed in, it will display a greeting with the user's email address.
 */
export default function Component() {
    /**
     * The useSession hook returns the session object from the server, if present.
     * If the user is not signed in, the session object will be null.
     */
    const {data: session} = useSession()
    if (session) {
        return (
            <>
                {/* If the user is signed in, display a greeting with their email address */}
                Signed in as {session.user.email} <br/>
                {/* Provide a button to sign out */}
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            {/* If the user is not signed in, display a message and provide a button to sign in */}
            Not signed in <br/>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}