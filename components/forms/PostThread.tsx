"use client"

// import { Form } from "@/components/ui/form"
import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ThreadValidation } from "@/lib/validations/thread";
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
import { createThread } from "@/lib/actions/thread.actions";

interface Props{
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}




    function PostThread({ userId } : { userId : string}){

        // const [files, setFiles] = useState<File[]>([])
        // const { startUpload } = useUploadThing("media")
        const router = useRouter();
        const pathname = usePathname();

        const form = useForm({
            resolver: zodResolver(ThreadValidation),
            defaultValues: {
                // profile_photo: user?.image || "",
                // name: user?.name || "",
                // username: user?.username || "",
                // bio: user?.bio || ""

                thread: "",
                accountId: userId,
            }
        })

        const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {

            await createThread({
                text: values.thread,
                author: userId,
                communityId: null,
                path: pathname

            });

            router.push("/")
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">

                    <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="mt-10 flex flex-col w-full gap-3">
                        <FormLabel className="text-base-semibold text-light-2">
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
                            Content
                        </FormLabel>
                        <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                            <Textarea rows={15} {...field} />
                        </FormControl>
                        <FormMessage />
                        {/* <FormDescription>
                            This is your public display name.
                        </FormDescription> */}
                        {/* <FormMessage /> */}
                        </FormItem>
                    )}
                    />

                    <Button type="submit" className="bg-primary-500">
                        Post Thread
                    </Button>

                </form>




            </Form>
        )
    }

export default PostThread
