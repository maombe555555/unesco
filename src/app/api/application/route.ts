// src\app\api\application\route.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Project from '@/models/Project';
import { type NextRequest, NextResponse } from "next/server"
import { forbidden } from "next/navigation"
import { getSession } from "@/lib/utils/sessionutil"
import dbConnect from "@/lib/Mongodb"
import {sendApplicationSubmissionEmail, sendApplicationSubmissionEmailToAdmin} from "@/lib/email/nodemailer"

// Function to verify if the current user is an applicant
async function verifyAccess(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    forbidden()
  }

  // Check if the user has role
  if (session.role !== "applicant") {
    forbidden()
  }
}

   export async function POST(req: NextRequest) {
     await dbConnect(); 
     await verifyAccess(req);

     try {
       const submissionData = await req.json(); 
       // Create a new project submission entry
       const newSubmission = new Project({
         projectName: submissionData.projectName,
         orgName: submissionData.orgName,
         orgType: submissionData.orgType,
         repName: submissionData.repName,
         email: submissionData.email,
         selectedProvince: submissionData.selectedProvince,
         selectedDistrict: submissionData.selectedDistrict,
         selectedSector: submissionData.selectedSector,
         selectedCell: submissionData.selectedCell,
         selectedVillage: submissionData.selectedVillage,
         contactFirstName: submissionData.contactFirstName,
         contactFamilyName: submissionData.contactFamilyName,
         contactEmail: submissionData.contactEmail,
         contactPersonIfNotLegal: submissionData.contactPersonIfNotLegal,
         projectPartners: submissionData.projectPartners,
         projectTeamMembers: submissionData.projectTeamMembers,
         projectTitle: submissionData.projectTitle,
         placeOfImplementation: submissionData.placeOfImplementation,
         startDate: submissionData.startDate,
         endDate: submissionData.endDate,
         projectDescription: submissionData.projectDescription,
         projectMainObjective: submissionData.projectMainObjective,
         specificObjectives: submissionData.specificObjectives,
         implementationPlan: submissionData.implementationPlan,
         targetGroups: submissionData.targetGroups,
         communicationPlan: submissionData.communicationPlan,
         supportingDocuments: submissionData.selectedFiles, // Assuming these are file paths or URLs
       });
       // Save to the database
       await newSubmission.save();


        const {   orgName, orgType, repName, selectedProvince, selectedDistrict, selectedSector, selectedCell, selectedVillage, contactFirstName, contactFamilyName, contactEmail, contactPersonIfNotLegal, projectPartners, projectTeamMembers,  placeOfImplementation, startDate, endDate, projectDescription, projectMainObjective, specificObjectives, implementationPlan, targetGroups, communicationPlan } = submissionData;
  
            // Generate a unique application ID
            

            const applicationId = newSubmission._id.toString(); 
            const projectTitle = newSubmission.projectTitle;
            const email = newSubmission.email;
            const ProjectName = newSubmission.projectName;
            const name = `${contactFirstName} ${contactFamilyName}`; 

            // console.log("Project submission created:", newSubmission);
            // console.log("Application ID:", applicationId);
            // console.log("Project Title:", projectTitle);
            // console.log("Applicant Email:", email);
            // console.log("Project Name:", ProjectName);

       // Send email to the applicant
           try {
              await sendApplicationSubmissionEmail( email, name, applicationId, projectTitle, ProjectName)
              await sendApplicationSubmissionEmailToAdmin(newSubmission)
            } catch (emailError) {
              console.error("Error sending confirmation email:", emailError)
              
            }

       return NextResponse.json({ message: 'Project submission created successfully!', submission: newSubmission }, { status: 201 });
     } catch (error) {
       console.error("Error saving project submission:", error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
       return NextResponse.json({ message: 'Failed to save project submission.', error: errorMessage }, { status: 500 });
     }
   }


// Get user's submitted projects

export async function GET(req: NextRequest) {
  await dbConnect();
  await verifyAccess(req);

  try {
    const session = await getSession();
    const userEmail = session?.email;

    if (!userEmail) {
      return NextResponse.json({ message: 'User email not found in session.' }, { status: 400 });
    }

    const projects = await Project.find({ email: userEmail }).sort({ createdAt: -1 }).lean();

    // Convert MongoDB documents to plain objects and ensure _id is properly serialized
    const serializedProjects = projects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return NextResponse.json({ projects: serializedProjects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch projects.', error: errorMessage }, { status: 500 });
  }
} 

  