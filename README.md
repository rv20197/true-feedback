# Anonymous Messaging App

This is a Next.js-based anonymous messaging app where users can send anonymous messages to others. The app also
integrates OpenAI's API to provide message suggestions and uses MongoDB with Mongoose for storing messages. It features
a custom authentication, authorization, and session management mechanism.

## Features

- **Anonymous Messaging**: Users can send messages anonymously to other users.
- **OpenAI Message Suggestions**: Get AI-powered suggestions for messages.
- **Mongoose Integration**: Messages are stored securely in MongoDB.
- **Custom Authentication, Authorization & Session Management**: A self-designed mechanism to authenticate, authorize
  users, and manage sessions.
- **Backend with Next.js API Routes**: Handles requests for message storage and AI suggestions.

## Tech Stack

- **Frontend**: Next.js, React.js
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication & Authorization**: Custom-designed mechanism with session management
- **AI Integration**: OpenAI API
- **State Management**: Context API / Zustand / Redux (if needed)

## Installation

### Prerequisites

- Node.js (>=22.x)
- MongoDB (Local or Cloud)
- OpenAI API Key

### Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/anonymous-messaging-app.git
   cd anonymous-messaging-app
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
   JWT_SECRET=your_secret_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. Run the app:
   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication & Session Management

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user and start session
- **POST** `/api/auth/logout` - Logout user and destroy session
- **GET** `/api/auth/session` - Check active session

### Messaging

- **POST** `/api/messages/send` - Send an anonymous message
- **GET** `/api/messages/user/{userId}` - Fetch received messages for a user

### AI Suggestions

- **POST** `/api/messages/suggest` - Get message suggestions from OpenAI

## Usage

1. Register or log in to access the messaging feature.
2. Use the AI-powered suggestion feature to generate message ideas.
3. Send anonymous messages to other users.
4. View received messages in the dashboard.

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

