"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface TransactionData {
    text: string
    amount: number
}

interface TransactionResult {
    data?: TransactionData
    error?: string
}


const addTransaction = async (fomrData: FormData): Promise<TransactionResult> => {
    const textValue = fomrData.get('text')
    const amountValue = fomrData.get('amount')

    //check for input values
    if (!textValue || textValue == '' || !amountValue) {
        return {
            error: "Text or amount is missing"
        }
    }

    //ensure textvalue is string
    const text: string = textValue.toString()
    //ensure amountvalue is number
    const amount: number = parseFloat(amountValue.toString())


    //get loggin in user
    const { userId } = auth()
    console.log(userId);

    //return error when user is not logged in
    if (!userId) {
        return {
            error: "User not found"
        }
    }

    try {
        const transactionData: TransactionData = await db.transaction.create({
            data: {
                text,
                amount,
                userId
            }
        })

        revalidatePath('/')

        return {
            data: transactionData
        }
    } catch (error) {
        return {
            error: 'Transaction not added'
        }
    }

}


export default addTransaction