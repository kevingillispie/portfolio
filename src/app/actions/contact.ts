// src/app/actions/contact.ts
"use server";  // ← This makes ALL exports in the file Server Actions

export async function sendContactForm(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Simulate processing (replace with real email/Resend later)
    await new Promise((resolve) => setTimeout(resolve, 1500)); // fake delay

    console.log("Contact form submitted:", { name, email, message });

    // Return success (or throw/return error)
    return { success: true, message: "Thanks! I'll get back to you soon." };

    // For real error handling:
    // throw new Error("Something went wrong.");
    // or return { success: false, error: "Failed to send." };
}