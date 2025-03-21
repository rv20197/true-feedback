'use client';
import {SessionProvider} from "next-auth/react";
import {ReactNode} from "react";

type AuthProviderProps = {
    children: ReactNode;
    session?: any;
};

/**
 * Provides session information to all components in the application.
 */
export default function AuthProvider({children, session}: AuthProviderProps) {
    return (
        /**
         * SessionProvider is a built-in component from Next-Auth that provides
         * information about the current user's session to all components in
         * the application.
         */
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
