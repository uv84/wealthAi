"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Header from "@/components/header";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message, consent }),
      });

      if (res.ok) {
        toast.success("Message sent — we\u2019ll get back to you soon.");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setConsent(false);
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error || "Failed to send message.");
      }
    } catch {
      toast.error("Network error. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit} aria-label="Contact us form">
      <div>
        <label className="text-sm font-medium">Full name *</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Email *</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Phone</label>
        <input
          type="tel"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 555-5555"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Subject *</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Message *</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 min-h-[120px] resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Write your message..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <label htmlFor="consent" className="text-sm">
          I agree to be contacted regarding this inquiry.
        </label>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium dark:text-black disabled:opacity-60 hover:bg-primary/80 text-white dark:hover:bg-primary/80"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
        <button
          type="button"
          className="text-sm text-muted-foreground rounded-md bg-primary/10 px-4 py-2 hover:bg-primary/20"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
            setConsent(false);
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default function Page() {
  return (
    <div>
    <Header />
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-6 md:p-10 mt-10">
        {/* <div className="flex justify-center gap-2 md:justify-start">
          <a href="/dashboard" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="h-4 w-4" />
            </div>
            Acme Inc.
          </a>
        </div> */}

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="mb-4 text-2xl font-semibold">Contact Us</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Have a question or need help? Send us a message and we\u2019ll respond as soon as possible.
            </p>

            <ContactForm />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block ">
        <Image
          src="/image.png"
          alt="Decorative"
          fill
          priority
          className="absolute inset-0 object-cover dark:brightness-[0.8] dark:grayscale "
        />
      </div>
    </div>
    </div>
  );
}
// ```// filepath: d:\Projects\wealth-ai-tsx\src\app\contactUs\page.tsx
// "use client";

// import React, { useState } from "react";
// import { GalleryVerticalEnd } from "lucide-react";
// import { toast } from "sonner";

// function ContactForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [consent, setConsent] = useState(false);