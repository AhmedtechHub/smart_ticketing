import React from "react";

interface MiniFormProps {
  onSubmit?: (data: Record<string, string>) => void;
}

const ContactMiniForm: React.FC<MiniFormProps> = ({ onSubmit }) => {
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit?.(Object.fromEntries(fd.entries()) as Record<string, string>);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-3">
        <input name="firstName" placeholder="First name" className="input" />
        <input name="lastName" placeholder="Last name" className="input" />
      </div>
      <div className="mt-3 space-y-3">
        <input name="phone" placeholder="Phone" className="input" />
        <input name="email" type="email" placeholder="Email" className="input" />
        <select name="contactMethod" className="input">
          <option>Preferred Contact Method</option>
          <option>Phone</option>
          <option>Email</option>
          <option>Text</option>
        </select>
        <select name="interest" className="input">
          <option>Interested In</option>
          <option>Consultation</option>
          <option>General Inquiry</option>
        </select>
        <textarea name="message" placeholder="Your Message" rows={4} className="input" />
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md bg-[#b88b5c] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#a17b4d]"
      >
        Submit
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          padding: 0.65rem 0.75rem;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
          border-color: rgba(59, 130, 246, 0.35);
        }
      `}</style>
    </form>
  );
};

export default ContactMiniForm;
