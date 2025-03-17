import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env: {
        RESEND_API_KEY: "re_5opzxcgP_BwKoLMrUopyD8mTgC8iRZmp7",
        MONGODB_URI: "mongodb://localhost:27017/true-feedback"
    }
};

export default nextConfig;
