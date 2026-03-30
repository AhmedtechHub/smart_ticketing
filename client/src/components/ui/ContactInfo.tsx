import React from "react";
import { Mail, Phone, MapPin, Printer } from "lucide-react";

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">
        Contact the Family Law Lawyers at Parra Harris Law in Jacksonville, FL
      </h2>

      <p className="text-gray-700">
        We look forward to hearing from you. You can contact us using the simple form to the right,
        or reach us at our office located at:
      </p>

      <div className="space-y-2 text-gray-800">
        <div className="font-semibold">Parra Harris Law</div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-[#b88b5c]" />
          <div>
            6810 St. Augustine Road
            <br />
            Jacksonville, Florida 32217
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-[#b88b5c]" />
          <a href="tel:9049001617" className="hover:underline">
            (904) 900-1617
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Printer className="h-4 w-4 text-[#b88b5c]" />
          <a href="fax:9045273390" className="hover:underline">
            (904) 527-3390
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#b88b5c]" />
          <a href="mailto:info@parraharrislaw.com" className="text-[#b88b5c] hover:underline">
            info@parraharrislaw.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
