'use client';
import {SessionProvider} from "next-auth/react";
import {ReactNode} from "react";

/**
 * Props for the AuthProvider component.
 */
type AuthProviderProps = {
    /**
     * The children prop should contain all the components in the application
     * that need to have access to the session information.
     */
    children: ReactNode;
    /**
     * The session prop is optional and can be used to pass in session
     * information from the server. If not provided, the component will
     * use the session information from the client.
     */
    session?: any;
};

/**
 * The AuthProvider component is a wrapper around the SessionProvider
 * component provided by Next-Auth. It provides information about the
 * current user's session to all components in the application.
 *
 * @param {AuthProviderProps} props - The props for the AuthProvider component.
 *
 * @returns {JSX.Element} - The AuthProvider component.
 */
export default function AuthProvider({children, session}: AuthProviderProps) {
    return (
        /**
         * The SessionProvider component provides information about the
         * current user's session to all components in the application.
         *
         * @see https://next-auth.js.org/configuration/session
         */
        <SessionProvider session={session}>
            {/**
             * The children prop should contain all the components in the
             * application that need to have access to the session
             * information.
             */}
            {children}
        </SessionProvider>
    );
}


