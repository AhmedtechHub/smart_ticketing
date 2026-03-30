import React from "react";

type ContactFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactPreference: "Call" | "Text" | "Email";
  preferredTime?: string;
  hearAbout?: string;
  message?: string;
};

interface ContactFormCardProps {
  onSubmit?: (values: ContactFormValues, event: React.FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  className?: string;
}

const ContactFormCard: React.FC<ContactFormCardProps> = ({
  onSubmit,
  submitText = "Submit",
  className = "",
}) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const values: ContactFormValues = {
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      contactPreference: (String(fd.get("contactPreference") || "Call") as
        | "Call"
        | "Text"
        | "Email"),
      preferredTime: String(fd.get("preferredTime") || ""),
      hearAbout: String(fd.get("hearAbout") || ""),
      message: String(fd.get("message") || ""),
    };

    onSubmit?.(values, e);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        // container
        "relative rounded-2xl p-6 md:p-8",
        "bg-gradient-to-br from-[#e7ecff] via-[#e6f0fb] to-[#dff6f3]",
        "shadow-[0_10px_30px_rgba(0,0,0,.06)]",
        "border border-[#a2b6ff]/60",
        // subtle outer glow like the screenshot
        "outline outline-1 outline-[#3b82f6]/30",
        "ring-1 ring-inset ring-white/50",
        className,
      ].join(" ")}
    >
      {/* blue rounded outline edge */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#2f6df6]/30"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* First / Last */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            required
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=""
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            required
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=""
            autoComplete="family-name"
          />
        </div>

        {/* Phone / Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            required
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=""
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=""
            autoComplete="email"
          />
        </div>

        {/* Contact preference radios (full width on small, split on md via grid) */}
        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Contact Preference <span className="text-red-500">*</span>
          </p>
          <div className="flex items-center gap-6">
            {["Call", "Text", "Email"].map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 text-gray-800">
                <input
                  type="radio"
                  name="contactPreference"
                  value={opt}
                  defaultChecked={opt === "Call"}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Preferred day/time & How did you hear about us */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Preferred day/time
          </label>
          <input
            name="preferredTime"
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., Monday mornings"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            How did you hear about us?
          </label>
          <input
            name="hearAbout"
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Google, friend, etc."
          />
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Your Message</label>
          <textarea
            name="message"
            rows={6}
            className="w-full rounded-md border border-black/10 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=""
          />
        </div>
      </div>

      {/* Actions + disclaimer */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold text-white
                     bg-gradient-to-r from-[#3b82f6] to-[#10b981]
                     shadow-[0_6px_20px_rgba(59,130,246,.35)]
                     hover:shadow-[0_8px_24px_rgba(59,130,246,.45)]
                     transition-all duration-300"
        >
          {submitText}
        </button>

        <p className="text-[12px] text-gray-600 leading-snug">
          By submitting this form, you agree that contacting us does not create an attorney–client
          relationship. Please do not send confidential information until an engagement is
          established.
        </p>
      </div>
    </form>
  );
};

export default ContactFormCard;
