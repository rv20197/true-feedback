import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt';

/**
 * This middleware function checks if the user is signed in and if the path is the signin, signup, verify or root path.
 * If the user is signed in and the path is one of the above, it redirects the user to the dashboard.
 * If the user is not signed in, it does nothing and allows the request to pass through to the next middleware or the page.
 * @param request The NextRequest object.
 * @returns The NextResponse object if the user is signed in and the path is the signin, signup, verify or root path, otherwise null.
 */
export async function middleware(request: NextRequest): Promise<NextResponse | null> {
    /**
     * Get the user's token from the cookies
     */
    const token = await getToken({req: request});
    /**
     * Get the current path of the request
     */
    const currentPath = request.nextUrl.pathname;
    // If the user is signed in and the path is the signin, signup, verify or root path, redirect to the dashboard.
    if (token && (currentPath.startsWith('/sign-in') || currentPath.startsWith('/sign-up') || currentPath.startsWith('/verify') || currentPath === '/')) {
        // Redirect the user to the dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If the user is not signed in and the path starts with /dashboard, redirect them to the signin page
    if (!token && currentPath.startsWith('/dashboard')) {
        // Redirect the user to the signin page
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If none of the above conditions are true, pass the request through to the next middleware or the page
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/sign-in', '/sign-up', "/", '/dashboard/:path*', "/verify/:path*"],
}