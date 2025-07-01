import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import TitleHeader from "../components/TitleHeader";
import { testimonials, testimonialStats } from "../constants";

const TestimonialCard = ({ testimonial, isActive }) => (
  <div
    className={`flex-shrink-0 w-full md:w-96 transition-all duration-500 ${
      isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
    }`}
  >
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:bg-white/10 transition-all duration-300">
      {/* Quote Icon */}
      <Quote className="text-[#00F0FF] mb-4 opacity-60" size={20} />

      {/* Review Text */}
      <p className="text-gray-300 leading-relaxed mb-6 text-sm line-clamp-4">
        {testimonial.review}
      </p>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.imgPath}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#5200FF]/30"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-white text-sm truncate">
            {testimonial.name}
          </h4>
          <p className="text-[#FF2DF7] text-xs opacity-80 truncate">
            {testimonial.mentions}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter real testimonials
  const realTestimonials = testimonials.filter(
    (t) => !t.name.includes("DUMYDUMY")
  );

  // Auto-scroll effect
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push({
        ...testimonials[index],
        index: index,
        isActive: i === 1, // Middle card is active
      });
    }
    return result;
  };

  return (
    <section
      id="testimonials"
      className="flex-center section-padding relative overflow-hidden"
    >
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="What People Say About Me?"
          sub="⭐ Client Feedback Highlights"
        />

        {/* Auto-Scrolling Testimonials */}
        <div className="mt-16 relative">
          {/* Desktop View - 3 Cards */}
          <div className="hidden md:block">
            <div
              className="flex justify-center items-center gap-8 px-8"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {getVisibleTestimonials().map((testimonial, i) => (
                <TestimonialCard
                  key={`${testimonial.index}-${i}`}
                  testimonial={testimonial}
                  isActive={testimonial.isActive}
                />
              ))}
            </div>
          </div>

          {/* Mobile View - 1 Card */}
          <div className="block md:hidden">
            <div
              className="flex justify-center px-4"
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <TestimonialCard
                testimonial={testimonials[currentIndex]}
                isActive={true}
              />
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8"
                    : "bg-white/20 w-2 hover:bg-white/40"
                }`}
                style={
                  index === currentIndex
                    ? {
                        background:
                          "linear-gradient(90deg, #00F0FF 0%, #5200FF 48%, #FF2DF7 100%)",
                      }
                    : {}
                }
              />
            ))}
          </div>
        </div>

        {/* Simple Stats */}
        <div className="mt-16 max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {testimonialStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
              >
                <div
                  className="text-xl md:text-2xl font-bold mb-1"
                  style={{
                    background:
                      "linear-gradient(90deg, #00F0FF 0%, #5200FF 48%, #FF2DF7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
