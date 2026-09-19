import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Layers3,
  Mail,
  MapPin,
} from "lucide-react";

import Navbar from "./components/Navbar";
import SectionTitle from "./components/SectionTitle";
import ProjectCard from "./components/ProjectCard";
import ContactForm from "./components/ContactForm";
import { skillGroups } from "./data/skills";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fallbackProjects = [
  {
    id: "landing-page",
    title: "Landing Page",
    image: "/projects/landing-page.png",
    category: "Frontend",
    description:
      "A responsive landing page focused on clean layout, modern styling, and a smooth experience across different screen sizes.",
    tech: ["HTML", "CSS", "Responsive Design"],
    featured: true,
    github: "https://github.com/marimfadel12/LandingPage",
    demo: "https://marimfadel12.github.io/LandingPage/",
  },
];

function App() {
  const heroVisualRef = React.useRef(null);
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    fetch(API + "/api/projects")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setProjects)
      .catch(() => {});
  }, []);

  // Skills scroll reveal
  useEffect(() => {
    const skillsSection = document.querySelector(".skills-reveal");

    if (!skillsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          skillsSection.classList.add("show");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(skillsSection);

    return () => observer.disconnect();
  }, []);

  // Capabilities scroll reveal
  useEffect(() => {
    const capabilitiesSection =
      document.querySelector(".capabilities-reveal");

    if (!capabilitiesSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          capabilitiesSection.classList.add("show");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(capabilitiesSection);

    return () => observer.disconnect();
  }, []);

  // About scroll reveal
  useEffect(() => {
    const revealElement = document.querySelector(".reveal");

    if (!revealElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealElement.classList.add("show");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(revealElement);

    return () => observer.disconnect();
  }, []);

  // Projects scroll reveal
  useEffect(() => {
    const projectElements =
      document.querySelectorAll(".project-reveal");

    if (!projectElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    projectElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [projects]);

  // Hero mouse movement
  const handleMouseMove = (e) => {
    if (!heroVisualRef.current) return;

    const rect = heroVisualRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroVisualRef.current.style.transform =
      "perspective(1000px) " +
      "rotateY(" +
      x * 8 +
      "deg) " +
      "rotateX(" +
      -y * 8 +
      "deg)";
  };

  const handleMouseLeave = () => {
    if (!heroVisualRef.current) return;

    heroVisualRef.current.style.transform =
      "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div>
      <Navbar />

      <main>
        {/* HERO */}
        <section id="home" className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">FRONTEND DEVELOPER</p>

            <h1>
              I build{" "}
              <span>
                clean, responsive, and engaging web experiences.
              </span>
            </h1>

            <p className="hero-text">
              I'm Mariam Fadel, a Computer Science student and
              Frontend Developer passionate about creating modern,
              responsive websites with a strong focus on user
              experience and clean code.
            </p>

            <div className="hero-actions">
              <a className="primary-btn" href="#projects">
                View my work <ArrowUpRight size={18} />
              </a>

              <a className="text-btn" href="#contact">
                Let's connect <ArrowDown size={17} />
              </a>
            </div>

            <div className="quick-stats">
              <div>
                <strong>Frontend</strong>
                <span>React · JavaScript · CSS</span>
              </div>

              <div>
                <strong>Responsive</strong>
                <span>Mobile · Tablet · Desktop</span>
              </div>

              <div>
                <strong>Approach</strong>
                <span>UX · Clean code</span>
              </div>
            </div>
          </div>

          <div
            className="hero-visual"
            ref={heroVisualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="code-window">
              <div className="window-bar">
                <i />
                <i />
                <i />
                <span>mariam.dev</span>
              </div>

              <pre>
                <code>
{`const developer = {
  name: "Mariam Fadel",
  role: "Frontend Developer",

  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React"
  ],

  mindset: "Build. Learn. Improve."
};`}
                </code>
              </pre>
            </div>

            <div className="floating-badge badge-one">
              <Code2 size={17} />
              Frontend
            </div>

            <div className="floating-badge badge-two">
              <Layers3 size={17} />
              React
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section container reveal">
          <SectionTitle
            eyebrow="01 — ABOUT"
            title="A frontend developer who loves turning ideas into interfaces."
          />

          <div className="about-grid">
            <div className="about-number">01</div>

            <div>
              <p className="large-copy">
                I’m passionate about building modern and responsive
                websites that are simple to use and enjoyable to
                interact with. I focus on turning ideas and designs
                into clean, functional frontend experiences.
              </p>

              <p className="muted-copy">
                I’m currently studying Computer Science at Benha
                University and developing my skills in HTML, CSS,
                JavaScript, and React through hands-on projects.
                My UI/UX background also helps me create interfaces
                with the user in mind.
              </p>
            </div>

            <div className="about-card">
              <Layers3 size={26} />

              <strong>Design + Development</strong>

              <span>
                Turning ideas and designs into polished frontend
                experiences.
              </span>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="section section-soft skills-reveal"
        >
          <div className="container">
            <SectionTitle
              eyebrow="02 — SKILLS"
              title="Tools I use to turn ideas into products."
            />

            <div className="skills-grid">
              {skillGroups.map((group) => (
                <div
                  className="skill-group"
                  key={group.title}
                >
                  <h3>{group.title}</h3>

                  <div className="skill-pills">
                    {group.items.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section container">
          <SectionTitle
            eyebrow="03 — PROJECTS"
            title="Selected work."
            text="A collection of frontend projects focused on responsive design, clean interfaces, and user experience."
          />

          <div className="projects-grid">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-reveal"
                style={{
                  "--delay": index * 0.15 + "s",
                }}
              >
                <ProjectCard
                  project={project}
                  index={index}
                />
              </div>
            ))}
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="section capabilities capabilities-reveal">
          <div className="container capability-grid">
            <div>
              <p className="eyebrow">WHAT I CAN BUILD</p>

              <h2>
                Interfaces that look good and work well.
              </h2>
            </div>

            <div className="capability-list">
              {[
                "Responsive websites",
                "React web applications",
                "Interactive interfaces",
                "Reusable components",
                "Responsive layouts",
                "User-focused experiences",
              ].map((item, i) => (
                <div key={item}>
                  <span>0{i + 1}</span>

                  <strong>{item}</strong>

                  <ArrowUpRight size={17} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section container">
          <div className="contact-box">
            <div className="contact-intro">
              <p className="eyebrow">04 — CONTACT</p>

              <h2>
                Have an idea?
                <br />
                <span>Let's build it.</span>
              </h2>

              <p>
                I'm open to internships, freelance work,
                collaborations, and interesting projects.
              </p>

              <div className="contact-meta">
                <span>
                  <Mail size={17} />
                  your.email@example.com
                </span>

                <span>
                  <MapPin size={17} />
                  Egypt
                </span>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <span>© 2026 Mariam Fadel</span>
          <span>Built with React</span>
        </div>
      </footer>
    </div>
  );
}

export default App;