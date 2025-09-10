import React from "react";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        Have questions or need help? Reach out to our support team and we'll get back to you as soon as possible.
      </p>
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg" />
        <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-lg" />
        <textarea placeholder="Your Message" className="w-full px-4 py-2 border rounded-lg" rows={5}></textarea>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Send Message</button>
      </form>
    </div>
  );
}
