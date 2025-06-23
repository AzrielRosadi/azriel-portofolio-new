import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import Lanyard from "../components/Contact/Lanyard/Lanyard";

const Contact = () => {
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // State untuk animasi
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLanyardVisible, setIsLanyardVisible] = useState(false);
  const [shouldStartPhysics, setShouldStartPhysics] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFormVisible(true);
          setIsLanyardVisible(true);

          setTimeout(() => {
            setShouldStartPhysics(true);
          }, 300);
        } else {
          setIsFormVisible(false);
          setIsLanyardVisible(false);
          setShouldStartPhysics(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    <section
      id="contact"
      ref={sectionRef}
      className="flex-center section-padding"
    >
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let's Connect"
          sub="💬 Have questions or ideas? Let's talk! 🚀"
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 mt-16 items-start">
          {/* KIRI: Formulir Kontak - SEPENUHNYA TRANSPARAN */}
          <div
            className={`xl:col-span-5 p-10 mt-35 transition-all duration-700 ${
              isFormVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            style={{
              background: "transparent", // Sepenuhnya transparan
              border: "none", // Tanpa border
            }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-7"
            >
              <div>
                <label
                  htmlFor="name"
                  className="text-white/90 font-medium mb-2 block"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="What's your good name?"
                  required
                  className="w-full p-3 rounded-lg bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-purple-400/80 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-white/90 font-medium mb-2 block"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="What's your email address?"
                  required
                  className="w-full p-3 rounded-lg bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-purple-400/80 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-white/90 font-medium mb-2 block"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  rows="5"
                  required
                  className="w-full p-3 rounded-lg bg-transparent border-b-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-purple-400/80 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-lg bg-transparent border-2 border-white/30 p-4 text-white font-medium hover:border-white hover:bg-white/30 transition-all duration-300"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <p>{loading ? "Sending..." : "Submit"}</p>
                  <div className="transform group-hover:translate-x-1 transition-transform"></div>
                </div>
              </button>
            </form>
          </div>

          {/* KANAN: Lanyard - SEPENUHNYA MENYATU */}
          <div
            className={`xl:col-span-7 overflow-hidden h-full flex items-start justify-center transition-all duration-500 ${
              isLanyardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{
              background: "transparent", // Sepenuhnya transparan
              border: "none", // Tanpa border
            }}
          >
            <div className="w-full h-full hover:cursor-grab rounded-xl">
              <Lanyard
                position={[0, 0, 13]}
                ty={[0, -80, 0]}
                startPhysics={shouldStartPhysics}
                fov={20}
                transparent={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
