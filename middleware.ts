import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    '/',
    '/posts/:id',
    '/assets/images/favicon.ico',
    '/assets/images/logo.svg',
    '/favicon.ico',
    '/assets/images/vision.png',
    '/assets/images/dotted-pattern.png',
    '/assets/icons/search.svg',
    '/api/webhooks/clerk',
    '/api/uploadthing'
  ],
  ignoredRoutes:[
    '/api/webhooks/clerk',
    '/api/uploadthing'
  ]
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};