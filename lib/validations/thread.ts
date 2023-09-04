import * as z from "zod";

export const ThreadValidation = z.object({
    // profile_photo: z.string().url().nonempty(),
    thread: z.string().min(3, { message: "Minimum 3 characters"}),
    accountId: z.string(),
    // name: z.string().min(3, { message: "Minimum 3 characters"}).max(30, { message: "Maximum 30 characters"}),
    // username: z.string().min(3, { message: "Minimum 3 characters"}).max(30, { message: "Maximum 30 characters"}),
    // bio: z.string().min(3, { message: "Minimum 3 characters"}).max(1000, { message: "Maximum 1000 characters"}),
})

export const CommentValidation = z.object({
    // Every comment is a thread of it's own
    thread: z.string().min(3, { message: "Minimum 3 characters"}),
})
