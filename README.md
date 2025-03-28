# Anonymous Messaging App

This is a Next.js-based anonymous messaging app where users can send anonymous messages to others. The app also
integrates OpenAI's API to provide message suggestions and uses MongoDB with Mongoose for storing messages. It features
a custom authentication, authorization, and session management mechanism.

## Features

- **Anonymous Messaging**: Users can send messages anonymously to other users.
- **OpenAI Message Suggestions**: Get AI-powered suggestions for messages.
- **Mongoose Integration**: Messages are stored securely in MongoDB.
- **Authentication & Authorization with Next-Auth**: Secure authentication and session management using Next-Auth.
- **User Message Toggle**: Users can enable or disable receiving anonymous messages.
- **Username Availability Check**: Ensure username availability during sign-up.
- **Email Verification**: Users must verify their email using a verification code during sign-up.
- **Email Service using Resend**: Email verification and notifications are handled via Resend.
- **Backend with Next.js API Routes**: Handles requests for message storage and AI suggestions.

## Tech Stack

- **Frontend**: Next.js, React.js
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication & Authorization**: Next-Auth with session management
- **Email Service**: Resend API
- **AI Integration**: OpenAI API

## Installation

### Prerequisites

- Node.js (>=22.x)
- MongoDB (Local or Cloud)
- OpenAI API Key
- Resend API Key

### Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/rv20197/true-feedback.git
   cd true-feedback
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   NEXTAUTH_SECRET=your_next_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_api_key
   ```
4. Run the app:
   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication & Session Management (Next-Auth)

- **POST** `/api/sign-up` - Register a new user
- **POST** `/api/sign-in` - Login user via Next-Auth
- **POST** `/api/sign-out` - Logout user via Next-Auth
- **GET** `/api/check-username?username={username}` - Check if a username is available
- **POST** `/api/verify-code` - Verify email using a code sent to the user's email

### Messaging

- **POST** `/api/send-message` - Send an anonymous message
- **GET** `/api/get-messages` - Fetch received messages for a user
- **PATCH** `/api/accept-messages` - Toggle message reception setting

### AI Suggestions

- **POST** `/api/suggest-messages` - Get message suggestions from OpenAI

## Usage

1. Register or log in using Next-Auth to access the messaging feature.
2. Verify your email using the code sent to your email inbox.
3. Use the AI-powered suggestion feature to generate message ideas.
4. Send anonymous messages to other users.
5. View received messages in the dashboard.
6. Toggle message reception on/off in settings.
7. Ensure your desired username is available before signing up.

## Deployment

To deploy the app:

1. Build the app:
   ```sh
   npm run build
   ```
2. Start the production server:
   ```sh
   npm start
   ```
3. Deploy to platforms like Vercel, Netlify, or DigitalOcean.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Create a Pull Request.

## License

This project is licensed under the MIT License.

