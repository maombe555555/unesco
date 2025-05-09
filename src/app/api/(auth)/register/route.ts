// src\app\api\(auth)\register\route.ts
import User from "@/models/User";
import dbConnect from "@/lib/Mongodb";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/utils/passwordUtil";
import { registerSchema } from "@/lib/validations/auth";
import { cookies } from "next/headers";
import {z} from "zod";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { names, email, password, phone, username } = registerSchema.parse(body)
        await dbConnect()
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 })
        }
        const hashedPassword = await hashPassword(password)
        const newUser = new User({ names, email, password: hashedPassword, phone , username})
        await newUser.save()
        return NextResponse.json({ message: "Registration successful", user: newUser }, { status: 201 })

    } catch (error) {
        console.error("Error during registration:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
