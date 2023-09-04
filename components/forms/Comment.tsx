"use client"

// import { Form } from "@/components/ui/form"
import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/thread";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import * as z from "zod"
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing"
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";

interface Props{
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({
    threadId,
    currentUserImg,
    currentUserId
}: Props) => {

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            // profile_photo: user?.image || "",
            // name: user?.name || "",
            // username: user?.username || "",
            // bio: user?.bio || ""

            thread: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {

        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );



        // router.push("/")

        // if wanted to add new comment
        form.reset();
    }

    return (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)} className="comment-form">

                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex w-full items-center gap-3">
                    <FormLabel>
                        {/* {field.value ? (
                            <Image
                                src={field.value}
                                alt = "profile photo"
                                width = {96}
                                height = {96}
                                priority
                                className="rounded-full object-contains"
                            />
                        ) : (
                            <Image
                                src="/assets/profile.svg"
                                alt = "profile photo"
                                width = {24}
                                height = {24}
                                className="object-contains"
                            />
                        )} */}
                        <Image
                            src = {currentUserImg}
                            alt = "Profile Image"
                            width={48}
                            height={48}

                        />
                    </FormLabel>
                    <FormControl className="border-none bg-transparent">
                        <Input type = "text" placeholder="Comment" className="no-focus text-light-1 outline-none" {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    {/* <FormMessage /> */}
                    </FormItem>
                )}
                />

                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>

            </form>




        </Form>
    )
}

export default Comment;
