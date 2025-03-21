import {streamText} from "ai";
import {openai} from '@ai-sdk/openai';

/**
 * Handles generating a list of 3 open-ended and engaging questions for a message.
 */
export async function POST() {
    try {
        // Prompt to generate a list of 3 open-ended and engaging questions
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // Use the ai-sdk to generate the list of questions
        const {textStream} = streamText({
            // Use the gpt-3.5-turbo model for generating the questions
            model: openai('gpt-3.5-turbo'),
            prompt
        })

        // Create an array to store the generated questions
        const responseArr = []

        // Iterate over the text stream and add each question to the array
        for await (const textPart of textStream) {
            responseArr.push(textPart);
        }

        // Join the questions into a single string with '||' as the separator
        const responseMessages = responseArr.join('||');

        // Return the response with a success status
        return Response.json({success: true, message: responseMessages}, {status: 200});
    } catch (e: any) {
        // Return an error response with a 500 status
        return Response.json({success: false, message: e?.message}, {status: 500});
    }
}
