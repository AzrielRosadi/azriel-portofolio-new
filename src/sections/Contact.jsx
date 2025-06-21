import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import Lanyard from "../components/Contact/Lanyard/Lanyard";

const Contact = () => {
  const formRef = useRef(null);
  const formVisibleRef = useRef(null);
  const lanyardVisibleRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLanyardVisible, setIsLanyardVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Observer untuk form
  useEffect(() => {
    const formObserver = new IntersectionObserver(
      ([entry]) => setIsFormVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (formVisibleRef.current) formObserver.observe(formVisibleRef.current);
    return () => formObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isFormVisible) {
      // Jika form sudah terlihat, tunggu 500ms sebelum lanyard muncul
      const timer = setTimeout(() => setIsLanyardVisible(true), 500);
      return () => clearTimeout(timer); // bersihkan timeout saat component unmount
    } else {
      setIsLanyardVisible(false); // reset saat form keluar layar
    }
  }, [isFormVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub="💬 Have questions or ideas? Let’s talk! 🚀"
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 mt-16 items-start">
          {/* Formulir Kontak */}
          <div
            ref={formVisibleRef}
            className={`xl:col-span-5 card-border rounded-xl p-10 bg-[#000000] mt-60 transition-all duration-700 ${
              isFormVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-7"
            >
              <div>
                <label htmlFor="name">Your name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="What’s your good name?"
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="What’s your email address?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  rows="5"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                <div className="cta-button group relative flex items-center justify-center gap-2">
                  <div className="bg-circle" />
                  <p className="text">{loading ? "Sending..." : "Submit"}</p>
                  <div className="arrow-wrapper">
                    <img src="/images/arrow-down.svg" alt="arrow" />
                  </div>
                </div>
              </button>
            </form>
          </div>

          {/* Lanyard */}
          <div
            ref={lanyardVisibleRef}
            className={`xl:col-span-7 bg-[#000000] rounded-xl overflow-hidden h-full flex items-start justify-center transition-all duration-700 ${
              isLanyardVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            <div className="w-full h-full hover:cursor-grab rounded-xl">
              <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
