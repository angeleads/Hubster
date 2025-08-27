"use client";

import type React from "react";

import { useProjectForm } from "../form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

export function Step2Functional() {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } =
    useProjectForm();

  const handleAddFunctionalPurpose = () => {
    updateFormData({
      functionalPurpose: [...formData.functionalPurpose, ""],
    });
  };

  const handleRemoveFunctionalPurpose = (index: number) => {
    const newPurposes = [...formData.functionalPurpose];
    newPurposes.splice(index, 1);
    updateFormData({ functionalPurpose: newPurposes });
  };

  const handleFunctionalPurposeChange = (index: number, value: string) => {
    const newPurposes = [...formData.functionalPurpose];
    newPurposes[index] = value;
    updateFormData({ functionalPurpose: newPurposes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Functional Purpose</CardTitle>
          <CardDescription>
            Describe what your project aims to accomplish
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.functionalPurpose.map((purpose, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={purpose}
                onChange={(e) =>
                  handleFunctionalPurposeChange(index, e.target.value)
                }
                className="border-2 border-purple-200 focus:border-purple-400"
                placeholder={`As a XXX, I want to XXX`}
                required
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFunctionalPurpose(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddFunctionalPurpose}
            className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Purpose
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Previous Step
        </Button>
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
