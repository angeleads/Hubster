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
import { useEffect } from "react";

export function Step4Deliverables() {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } =
    useProjectForm();

  // Ensure deliverables is always an array
  useEffect(() => {
    if (
      !formData.deliverables ||
      !Array.isArray(formData.deliverables) ||
      formData.deliverables.length === 0
    ) {
      // Only update if necessary to avoid infinite loops
      const defaultDeliverables = [{ functionality: "", details: "", days: 1 }];

      // Check if we need to update to avoid infinite loops
      const needsUpdate =
        !formData.deliverables ||
        !Array.isArray(formData.deliverables) ||
        formData.deliverables.length === 0;

      if (needsUpdate) {
        updateFormData({
          deliverables: defaultDeliverables,
        });
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Use a safe version of deliverables that's guaranteed to be an array
  const deliverables = Array.isArray(formData.deliverables)
    ? formData.deliverables
    : [{ functionality: "", details: "", days: 1 }];

  // Calculate total estimated days whenever deliverables change
  useEffect(() => {
    if (Array.isArray(formData.deliverables)) {
      const total = formData.deliverables.reduce(
        (sum, item) => sum + (item.days || 0),
        0
      );

      // Only update if the total has changed
      if (total !== formData.totalEstimatedDays) {
        updateFormData({ totalEstimatedDays: total });
      }
    }
  }, [formData.deliverables, formData.totalEstimatedDays]);

  const handleAddDeliverable = () => {
    updateFormData({
      deliverables: [
        ...deliverables,
        { functionality: "", details: "", days: 1 },
      ],
    });
  };

  const handleRemoveDeliverable = (index: number) => {
    const newDeliverables = [...deliverables];
    newDeliverables.splice(index, 1);
    updateFormData({ deliverables: newDeliverables });
  };

  const handleDeliverableChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateFormData({ deliverables: newDeliverables });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deliverable Organization</CardTitle>
          <CardDescription>
            Break down your project into specific deliverables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliverables.map((deliverable, index) => (
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
                  onClick={() => handleRemoveDeliverable(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="space-y-2">
                <Label htmlFor={`functionality-${index}`}>Functionality</Label>
                <Input
                  id={`functionality-${index}`}
                  value={deliverable.functionality}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      "functionality",
                      e.target.value
                    )
                  }
                  placeholder="e.g., User Authentication"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`details-${index}`}>Details</Label>
                <Textarea
                  id={`details-${index}`}
                  value={deliverable.details}
                  onChange={(e) =>
                    handleDeliverableChange(index, "details", e.target.value)
                  }
                  placeholder="Describe the details of this functionality"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`days-${index}`}>Days to Develop</Label>
                <Input
                  id={`days-${index}`}
                  type="number"
                  min="1"
                  value={deliverable.days}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      "days",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddDeliverable}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Deliverable
          </Button>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Estimated Time:</span>
              <span className="font-bold">
                {formData.totalEstimatedDays} days
              </span>
            </div>
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
