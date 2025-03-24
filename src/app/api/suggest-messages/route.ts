import {streamText} from "ai";
import {openai} from '@ai-sdk/openai';
import OpenAI from "openai";
import {NextResponse} from "next/server";

/**
 * Handles generating a list of 3 open-ended and engaging questions for a message.
 */
export async function POST() {
    try {
        // Prompt to generate a list of 3 open-ended and engaging questions
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // Use the ai-sdk to generate the list of questions
        const result = streamText({
            // Use the gpt-3.5-turbo model for generating the questions
            model: openai('gpt-3.5-turbo'),
            prompt
        })

        // Return the response with a success status
        return result.toDataStreamResponse();
    } catch (error: unknown) {
        if (error instanceof OpenAI.APIError) {
            // OpenAI API error handling
            const {name, status, headers, message} = error;
            return NextResponse.json({name, status, headers, message}, {status});
        } else {
            // General error handling
            console.error('An unexpected error occurred:', error);
            throw error;
        }
    }
}
