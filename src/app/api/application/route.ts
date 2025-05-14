// src/app/api/applicants/status/route.ts
   import dbConnect from '../../../lib/Mongodb'; // Adjust the path as necessary
   import ProjectSubmission from '../../../models/ProjectSubmission'; // Adjust the path as necessary
   import { NextApiRequest, NextApiResponse } from 'next';
   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     await dbConnect(); // Connect to MongoDB
     if (req.method === 'GET') {
       const { email } = req.query; // Get email from query parameters
       if (!email || Array.isArray(email)) {
         return res.status(400).json({ message: 'Invalid request' });
       }
       try {
         const submission = await ProjectSubmission.findOne({ email }); // Fetch application based on email
         if (!submission) {
           return res.status(404).json({ message: 'Application not found' });
         }
         // Return the status of the application
         res.status(200).json({ status: submission.status || 'Pending' }); // Assuming 'status' is a field in your model
       } catch (error) {
         console.error("Error fetching application status:", error);
         res.status(500).json({ message: 'Failed to fetch application status.' });
       }
     } else {
       res.setHeader('Allow', ['GET']);
       res.status(405).end(`Method ${req.method} Not Allowed`);
     }
   }