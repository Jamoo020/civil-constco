"use client";
import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      let result: any = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        setStatus("success");
        setFeedback(result.message || "Your inquiry has been submitted.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setFeedback(result.error || "Unable to send your message. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setFeedback("Network error. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="text-gray-700">Send us your project brief, request a quote, or ask about coastal and national civil construction delivery.</p>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Name</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Message</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-steel focus:ring-2 focus:ring-steel/20"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-lg bg-steel px-6 py-3 text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </button>

      <div aria-live="polite" className="text-sm text-gray-700">
        {feedback}
      </div>
    </form>
  );
}
