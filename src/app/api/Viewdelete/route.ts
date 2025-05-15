/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;
const dbName = 'APPLICATION'; // Make sure this is correct
const collectionName = 'combinedform'; // Make sure this is correct

async function connectDB() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

// This is the important part - the GET handler
export async function GET() {
  try {
    const projectsCollection = await connectDB();
    const projects = await projectsCollection.find({}).toArray();
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error fetching projects", error);
    return NextResponse.json({ message: "Failed to fetch projects", error: error.message }, { status: 500 });
  }
}

// You might have other handlers here (e.g., POST, DELETE for the base URL - which is generally not the pattern for deleting a specific resource)