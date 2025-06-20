import React from "react";
import { ProjectCard } from "@/components/cards/project-card";

type Project = {
  id: string;
  name: string;
  summary: string;
  programming_language?: string[];
  status: string;
  total_estimated_days: number;
  created_at: string;
  presentation_date: string;
};

interface ProjectCardsListProps {
  projects: Project[];
  status?: string;
  emptyMessage: string;
}

export function ProjectCardsList({
  projects,
  status,
  emptyMessage,
}: ProjectCardsListProps) {
  const filteredProjects = status
    ? projects.filter((project: Project) => project.status === status)
    : projects;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project: Project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            summary={project.summary}
            programmingLanguages={project.programming_language ?? []}
            status={project.status}
            totalEstimatedDays={project.total_estimated_days}
            createdAt={project.created_at}
            presentationDate={project.presentation_date}
            isDraft={project.status === "draft"}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
