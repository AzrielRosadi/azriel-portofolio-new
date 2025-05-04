import React from "react";

const ShowcaseSection = () => {
  return (
    <div id="work" className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          {/* LEFT */}
          <div className="first-project-wrapper">
            <div className="image-wrapper">
              <img src="/images/liboyyy.png" alt="Topup" />
            </div>
            <div className="text-content">
              <h2>Platform top-up game dan layanan sosial media.</h2>
              <p className="text-white-50 md:text-xl">
                Tech stack yang digunakan: <br />
                <span className="block">
                  Frontend: React, TypeScript, TailwindCSS, React Query
                </span>
                <span className="block">
                  Backend: Node.js, Express, Passport.js
                </span>
                <span className="block">Database: PostgreSQL, Drizzle ORM</span>
                <span className="block">
                  Tools: Vite, Shadcn/UI, Framer Motion
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="project-list-wrapper overflow-hidden">
            <div className="project">
              <div className="image-wrapper bg-white">
                <img src="/images/MbuuttProject.png" alt="laundry" />
              </div>
              <h2>Sistem Laundry berbasis Website.</h2> <br />
              <p className="text-white-50 md:text-xl">
                Tech stack yang digunakan: <br />
                <span className="block">
                  Frontend: Blade Template Engine & TailwindCSS
                </span>
                <span className="block">Backend: Laravel 11 (PHP), Laravel Breeze, & Laravel Sanctum</span>
                <span className="block">Database: MySQL</span>
                <span className="block">Tools: Vite</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseSection;
