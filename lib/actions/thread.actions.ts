"use server"

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params{
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({text, author, communityId, path}: Params){
    try{

        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        // Updating user model
        await User.findByIdAndUpdate(
            author, {
                $push: {
                    threads: createdThread._id
                }
            }
        )

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error creating threadL ${error.message}`)
    }



}

export async function fetchThreads(pageNumber = 1, pageSize = 20){

    connectToDB();

    // Calculate number of posts to skip
    const skipAmount = (pageNumber -1) * pageSize;


    // Fetch posts without parents (Main, without parents)
    const threadsQuery = Thread.find({
        parentId: {
            $in: [
                null, undefined
            ]
        }
    }).sort({
        createdAt: "desc"
    }).skip(skipAmount)
    .limit(pageSize)
    .populate({
        path: "author",
        model: User
    })
    .populate({
        path: "children",
        populate: {
            path: "author",
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalThreadsCount = await Thread.countDocuments({
        parentId: {
            $in: [
                null, undefined
            ]
        }
    })

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return {
        threads, isNext
    };

}


export async function fetchThreadById(id: string) {
    connectToDB();

    try{


        // Populate Community


        // Populate Threads/Chidren

        const thread = await Thread.findById(id)
        .populate({
            path: "author",
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: "children",
            populate: [
                {
                    path: "author",
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec();

        return thread;

    } catch(error: any){
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}


export async function addCommentToThread (
    threadId: string,
    commentText: string,
    userId: string,
    path: string,

) {
    connectToDB();

    try{

        // Add Comment

        // Find original thread first
        const originalThread = await Thread.findById(threadId);

        if(!originalThread){
            throw new Error("Thread not found")
        }

        // Create new thread as a comment

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentid: threadId,
        })

        // Save this thread

        const savedCommentThread = await commentThread.save();

        // Update original thread with new comment

        originalThread.children.push(savedCommentThread._id);


        // Save original thread

        await originalThread.save();

        revalidatePath(path);


    } catch(error: any){
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}
