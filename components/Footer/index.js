import React, { useState } from "react";
import Socials from "../Socials";
import Link from "next/link";
import Button from "../Button";
import ContactForm from "../ContactForm";
import { useTheme } from "next-themes";

const Footer = ({}) => {
  const { theme } = useTheme();
  const [showContactForm, setShowContactForm] = useState(false);

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  return (
    <>
      <div
        className="mt-5 laptop:mt-40 p-2 laptop:p-0"
        style={{ direction: "rtl" }}
      >
        <div>
          <h1
            className={`text-2xl text-bold text-right ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            تماس
          </h1>
          <div className="mt-10">
            <h1
              className={`text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold text-right ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              بیایید با هم
            </h1>
            <h1
              className={`text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold text-right ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              کار کنیم
            </h1>
            <div className="mt-6">
              <Button
                type="primary"
                onClick={toggleContactForm}
                classes="py-3 px-8 text-lg hover:scale-105"
              >
                تنظیم تماس
              </Button>
            </div>
            <div className="mt-10">
              <Socials />
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm
            isVisible={showContactForm}
            onClose={() => setShowContactForm(false)}
          />
        </div>
      </div>
      <h1
        className={`text-sm text-bold mt-2 laptop:mt-10 p-2 laptop:p-0 text-right ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
        style={{ direction: "rtl" }}
      >
        ساخته شده با ❤ توسط{" "}
        <Link href="https://pyrotechteam.ir">
          <a
            className={`underline underline-offset-1 ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {" "}
            Pyrotech
          </a>
        </Link>
      </h1>
    </>
  );
};

export default Footer;
