import React from "react";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <div className="project-visual">
        <img
          src={project.image}
          alt={`${project.title} preview`}
        />
      </div>

      <div className="project-content">
        <div className="project-top">
          <span className="project-category">{project.category}</span>

          {project.featured && (
            <span className="featured">Featured</span>
          )}
        </div>

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="tech-list">
          {project.tech.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} />
            GitHub
          </a>

          {project.demo !== "#" && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}