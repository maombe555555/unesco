import {z} from 'zod';

export const applicationSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required" }),
    status: z.enum(["pending", "rejected", "accepted"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    });

export type ApplicationInput = z.infer<typeof applicationSchema>;


