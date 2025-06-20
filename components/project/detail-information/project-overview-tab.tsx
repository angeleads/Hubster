import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, FileText, Clock, Calendar } from "lucide-react";
import { ProjectDetails } from "@/types/project";

export function ProjectOverviewTab({ project }: { project: ProjectDetails }) {
  return (
    <div className="space-y-6 mt-6">
      <Card className="bg-purple-100 border-purple-100">
        <CardHeader>
          <CardTitle className="text2xl font-bold text-black">
            Project Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">{project.summary}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-purple-100 border-purple-100">
          <CardHeader>
            <CardTitle className="text-black">Project Leader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">
                {project.profiles?.full_name || "Unknown User"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">
                {project.profiles?.tekx_position || "No position specified"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg2purple-100 border-purple-100">
          <CardHeader>
            <CardTitle className="text-black">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">
                Estimated: {project.total_estimated_days} days
              </span>
            </div>
            {project.presentation_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  Presentation:{" "}
                  {new Date(project.presentation_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-purple-100 border-purple-100">
        <CardHeader>
          <CardTitle className="text-black">Functional Purpose</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {project.functional_purpose.map((purpose, index) => (
              <li key={index} className="text-slate-600">
                {purpose}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {project.admin_feedback && (
        <Card className="border-2 border-yellow-100 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-black">Admin Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">{project.admin_feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
