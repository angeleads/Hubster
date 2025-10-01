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

export function Step1Basics() {
  const { formData, updateFormData, goToNextStep } = useProjectForm();

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
              className="border-2 border-purple-200 focus:border-purple-400"
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Project Summary</Label>
            <Textarea
              id="description"
              value={formData.description}
              className="border-2 border-purple-200 focus:border-purple-400"
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Provide a brief summary of your project"
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-purple-300 text-purple-600 hover:bg-purple-400 hover:text-purple-800"
        >
          Next Step
        </Button>
      </div>
    </form>
  );
}