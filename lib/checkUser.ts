import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const checkUser = async () => {
    const user = await currentUser()
    
    //check for current logged in clerk user
    if (!user) {
        return null
    }

    //check the user is already in the db
    const loggedInUser = await db.user.findUnique({
        where: {
            clerkUserId: user?.id
        }
    })

    //if user is in db then return that user
    if (loggedInUser) {
        return loggedInUser
    }


    //if not then create a new user
    const newUser = await db.user.create({
        data: {
            clerkUserId: user?.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })


    return newUser
}