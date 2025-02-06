"user server"

import User from "@/lib/models/user.models";
import {connect} from "@/lib/db";

export async function createUser(user: unknown){
    try{
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    }catch(error){
        console.log(error);
    }
}