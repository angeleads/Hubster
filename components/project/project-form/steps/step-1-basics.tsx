"use client";

import type React from "react";

import { useProjectForm } from "../form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

export function Step1Basics() {
  const { formData, updateFormData, goToNextStep } = useProjectForm();

  const handleAddLeader = () => {
    updateFormData({
      leaders: [...formData.leaders, { name: "", tekx: "", position: "" }],
    });
  };

  const handleRemoveLeader = (index: number) => {
    const newLeaders = [...formData.leaders];
    newLeaders.splice(index, 1);
    updateFormData({ leaders: newLeaders });
  };

  const handleLeaderChange = (index: number, field: string, value: string) => {
    const newLeaders = [...formData.leaders];
    newLeaders[index] = { ...newLeaders[index], [field]: value };
    updateFormData({ leaders: newLeaders });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Basics</CardTitle>
          <CardDescription>
            Provide the basic information about your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Project Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => updateFormData({ summary: e.target.value })}
              placeholder="Provide a brief summary of your project"
              required
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Leader(s)</CardTitle>
          <CardDescription>
            Add all team members working on this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.leaders.map((leader, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border rounded-md relative"
            >
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveLeader(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="space-y-2">
                <Label htmlFor={`leader-name-${index}`}>Full Name</Label>
                <Input
                  id={`leader-name-${index}`}
                  value={leader.name}
                  onChange={(e) =>
                    handleLeaderChange(index, "name", e.target.value)
                  }
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`leader-tekx-${index}`}>TEKX</Label>
                <Input
                  id={`leader-tekx-${index}`}
                  value={leader.tekx}
                  onChange={(e) =>
                    handleLeaderChange(index, "tekx", e.target.value)
                  }
                  placeholder="e.g., TEK1, TEK2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`leader-position-${index}`}>Position</Label>
                <Input
                  id={`leader-position-${index}`}
                  value={leader.position}
                  onChange={(e) =>
                    handleLeaderChange(index, "position", e.target.value)
                  }
                  placeholder="e.g., Developer, Designer"
                  required
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddLeader}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Team Member
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="bg-purple-300 text-purple-600 hover:bg-purple-400 hover:text-purple-800">Next Step</Button>
      </div>
    </form>
  );
}
