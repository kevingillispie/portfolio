"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { sendContactForm } from "@/app/actions/contact";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    subject: z.string().min(2, { message: "Please enter a brief subject." }),
    message: z
        .string()
        .min(10, { message: "Message must be at least 10 characters." })
        .max(500, { message: "Message is too long (max 500 chars)." }),
});

type FormState = {
    success: boolean;
    message: string;
} | null;

export default function ContactForm() {
    const router = useRouter();

    const [submissionTime] = useState(() => Math.floor(Date.now() / 1000).toString());

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        mode: "onBlur", // or "onChange" if you prefer real-time
    });

    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        sendContactForm,
        null
    );

    // Handle success → toast + reset + redirect
    useEffect(() => {
        if (state?.success) {
            toast.success("Message sent successfully!", {
                description: state.message,
            });
            form.reset();

            // Redirect after a short delay so the user sees the toast
            const timer = setTimeout(() => {
                router.push("/thank-you");
            }, 1200);

            return () => clearTimeout(timer);
        }
        else if (state && !state.success) {
            toast.error("Submission failed", {
                description: state.message || "Please try again.",
            });
        }
    }, [state, form, router]);

    return (
        <Card className="max-w-lg mx-auto bg-linear-to-br from-zinc-100 via-zinc-50 to-zinc-200 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 shadow-xl">
            <CardContent>
                <Form {...form}>
                    <form action={formAction} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <>
                                    <FormItem className="rounded bg-linear-to-r from-zinc-50 to-zinc-100 dark:bg-linear-to-r dark:from-slate-800 dark:to-slate-950">
                                        <FormLabel className="sr-only">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full Name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                    <div className="relative">
                                        <FormMessage className="absolute -top-6" />
                                    </div>
                                </>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <>
                                    <FormItem className="rounded bg-linear-to-r from-zinc-50 to-zinc-100 dark:bg-linear-to-r dark:from-slate-800 dark:to-slate-950">
                                        <FormLabel className="sr-only">Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                    <div className="relative">
                                        <FormMessage className="absolute -top-6" />
                                    </div>
                                </>
                            )}
                        />

                        {/* HONEYPOT — bots fill it, humans never see it */}
                        <div className="absolute -left-[9999px] overflow-hidden h-0">
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        {/* TIMESTAMP — proves the page was loaded in a real browser */}
                        <input type="hidden" name="timestamp" value={submissionTime} />

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <>
                                    <FormItem className="rounded bg-linear-to-r from-zinc-50 to-zinc-100 dark:bg-linear-to-r dark:from-slate-800 dark:to-slate-950">
                                        <FormLabel className="sr-only">Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Subject" {...field} />
                                        </FormControl>
                                    </FormItem>
                                    <div className="relative">
                                        <FormMessage className="absolute -top-6" />
                                    </div>
                                </>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <>
                                    <FormItem className="rounded bg-linear-to-br from-zinc-50 to-zinc-100 dark:bg-linear-to-br dark:from-slate-800 dark:to-slate-950">
                                        <FormLabel className="sr-only">Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Message"
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                    <div className="relative">
                                        <FormMessage className="absolute -top-6" />
                                    </div>
                                </>
                            )}
                        />

                        <CardFooter className="p-0 pt-6 flex flex-col sm:flex-row gap-4 items-center">
                            {/* Turnstile centered on mobile, left-aligned on larger screens */}
                            <div className="flex-1 flex justify-center sm:justify-start">
                                <div
                                    className="cf-turnstile"
                                    data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
                                    data-theme="auto"
                                    data-appearance="interaction-only"
                                    data-size="normal"
                                    data-response-field-name="cf-turnstile-response"
                                />
                            </div>

                            <Button
                                variant="default"
                                type="submit"
                                className="w-full sm:w-auto dark:bg-transparent dark:text-foreground dark:hover:text-white dark:border dark:hover:bg-slate-700"
                                size="lg"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Message"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card >
    );
}