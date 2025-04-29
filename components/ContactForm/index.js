import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import Button from "../Button";

const ContactForm = ({ isVisible, onClose }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "لطفا نام خود را وارد کنید";
    }
    
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = "لطفا ایمیل یا شماره تماس را وارد کنید";
      newErrors.phone = "لطفا ایمیل یا شماره تماس را وارد کنید";
    }
    
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "ایمیل معتبر نیست";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "لطفا موضوع کاری را وارد کنید";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error('Failed to send email');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      alert('خطا در ارسال ایمیل. لطفا دوباره تلاش کنید.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Send email through API
        const emailSent = await sendEmail();
        
        if (emailSent) {
          setSubmitted(true);
          
          // Reset form after submission
          setTimeout(() => {
            setFormData({
              name: "",
              email: "",
              phone: "",
              subject: ""
            });
            setSubmitted(false);
            if (onClose) onClose();
          }, 5000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          تماس با ما
        </h2>
        
        {submitted ? (
        <div className={`p-6 mb-6 rounded-lg text-center ${theme === "dark" ? "bg-green-800 border border-green-700" : "bg-green-100"}`}>
          <p className={`text-lg ${theme === "dark" ? "text-white" : "text-green-800"}`}>
            پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.
          </p>
          <Button 
            onClick={onClose}
            classes="mt-4"
            type="primary"
          >
            بستن
          </Button>
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className={`w-full p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900 text-white border border-gray-700" : "bg-white text-gray-800"}`}
        >
          <div className="mb-6">
            <label 
              className="block text-lg mb-2" 
              htmlFor="name"
            >
              نام و نام خانوادگی *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border-2 ${
                theme === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-800"
              } ${errors.name ? "border-red-500" : ""}`}
              placeholder="نام و نام خانوادگی خود را وارد کنید"
              dir="rtl"
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-lg mb-2" 
                htmlFor="email"
              >
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border-2 ${
                  theme === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-800"
                } ${errors.email ? "border-red-500" : ""} ${isSubmitting ? "opacity-50" : ""}`}
                placeholder="ایمیل خود را وارد کنید"
                dir="ltr"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label 
                className="block text-lg mb-2" 
                htmlFor="phone"
              >
                شماره تماس
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 rounded-md border-2 ${
                  theme === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-800"
                } ${errors.phone ? "border-red-500" : ""} ${isSubmitting ? "opacity-50" : ""}`}
                placeholder="شماره تماس خود را وارد کنید"
                dir="ltr"
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <label 
              className="block text-lg mb-2" 
              htmlFor="subject"
            >
              موضوع کاری *
            </label>
            <textarea
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 rounded-md border-2 ${
                theme === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-800"
              } ${errors.subject ? "border-red-500" : ""} ${isSubmitting ? "opacity-50" : ""}`}
              placeholder="لطفا موضوع کاری که به آن علاقه‌مند هستید را شرح دهید"
              dir="rtl"
              disabled={isSubmitting}
            ></textarea>
            {errors.subject && <p className="text-red-500 mt-1">{errors.subject}</p>}
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={onClose}
              classes={`py-3 px-6 text-lg ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              classes={`py-3 px-8 text-lg ${isSubmitting ? '' : 'hover:scale-105'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>در حال ارسال...</span>
                </div>
              ) : (
                "ارسال پیام"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  </div>
  );
};

export default ContactForm;
