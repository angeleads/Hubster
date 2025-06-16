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

export function Step3Technical() {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } =
    useProjectForm();

  const handleAddLanguage = () => {
    updateFormData({
      programmingLanguages: [...formData.programmingLanguages, ""],
    });
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = [...formData.programmingLanguages];
    newLanguages.splice(index, 1);
    updateFormData({ programmingLanguages: newLanguages });
  };

  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...formData.programmingLanguages];
    newLanguages[index] = value;
    updateFormData({ programmingLanguages: newLanguages });
  };

  const handleAddResource = () => {
    updateFormData({
      resources: [...formData.resources, ""],
    });
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...formData.resources];
    newResources.splice(index, 1);
    updateFormData({ resources: newResources });
  };

  const handleResourceChange = (index: number, value: string) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    updateFormData({ resources: newResources });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
          <CardDescription>
            Provide information about the technical aspects of your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material">Material (if needed)</Label>
            <Textarea
              id="material"
              value={formData.material}
              onChange={(e) => updateFormData({ material: e.target.value })}
              placeholder="Describe any hardware or special materials needed for your project"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Programming Languages</Label>
            {formData.programmingLanguages.map((language, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={language}
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                  placeholder="e.g., JavaScript, Python"
                  required
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLanguage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddLanguage}
              className="w-full mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Another Language
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Resources (API, course material, documentation links)</Label>
            {formData.resources.map((resource, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={resource}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  placeholder="e.g., https://api.example.com"
                  required
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResource(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddResource}
              className="w-full mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Another Resource
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Previous Step
        </Button>
        <Button type="submit">Next Step</Button>
      </div>
    </form>
  );
}
