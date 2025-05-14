// src/app/api/applicants/route.ts
   import dbConnect from '../../../lib/Mongodb'; // Ensure this path is correct
   import ProjectSubmission from '../../../models/ProjectSubmission'; // Ensure this path is correct
   import { NextRequest, NextResponse } from 'next/server';
   export async function POST(req: NextRequest) {
     await dbConnect(); // Connect to MongoDB
     try {
       const submissionData = await req.json(); // Parse JSON body
       // Create a new project submission entry
       const newSubmission = new ProjectSubmission({
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
       return NextResponse.json({ message: 'Project submission created successfully!', submission: newSubmission }, { status: 201 });
     } catch (error) {
       console.error("Error saving project submission:", error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
       return NextResponse.json({ message: 'Failed to save project submission.', error: errorMessage }, { status: 500 });
     }
   }