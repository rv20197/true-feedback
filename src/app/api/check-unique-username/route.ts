import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import {userNameValidation} from "@/schemas/signUp.schema";
import UserModel from "@/models/User";

const userNameQuerySchema = z.object({
    username: userNameValidation
});

export const GET = async (request: Request) => {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = userNameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            return Response.json({success: false, message: result.error.format().username?._errors}, {status: 400});
        }
        const existingUser = await UserModel.findOne({username: result.data.username});
        if (existingUser) {
            return Response.json({success: false, message: "Username is already taken"}, {status: 400});
        }
        return Response.json({success: true, message: "Username is unique"}, {status: 200});
    } catch (e) {
        console.error('Error checking unique username', e);
        return Response.json({success: false, message: "Error checking unique username"}, {status: 500});
    }
}