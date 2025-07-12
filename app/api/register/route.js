import { NextResponse } from "next/server";
import User from "@/app/models/user";
import { connectMongoDb } from "@/app/lib/mongodb";
// import bcrypt from "bcryptjs"; // No longer needed

export async function POST(req) {

    try {
        await connectMongoDb();
        const { name, email, whatsappNumber, password } = await req.json();
        
        // Validate required fields
        if (!name || !email || !whatsappNumber || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Create new user (password will be hashed by model)
        const newUser = await User.create({
            name,
            email,
            whatsappNumber,
            password
        });

        return NextResponse.json(
            { 
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "An error occurred while registering user" },
            { status: 500 }
        );
    }
}