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
import { PlusCircle, Trash2, Calculator } from "lucide-react";
import { useEffect } from "react";

export function Step4Deliverables() {
  const {
    formData,
    updateFormData,
    goToNextStep,
    goToPreviousStep,
    calculateCredits,
  } = useProjectForm();

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
  }, [formData.deliverables, formData.totalEstimatedDays, updateFormData]);

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
              className="space-y-4 p-4 rounded-md relative border border-purple-200"
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
                  className="border-2 border-purple-200 focus:border-purple-400"
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
                  className="border-2 border-purple-200 focus:border-purple-400"
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
                  className="border-2 border-purple-200 focus:border-purple-400"
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
            className="w-full bg-transparen bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800t"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Deliverable
          </Button>

          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Calculator className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Project Estimation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md border border-purple-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      Total Estimated Time:
                    </span>
                    <span className="font-bold text-purple-600 text-lg">
                      {formData.totalEstimatedDays} days
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md border border-purple-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      Credits Earned:
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formData.totalCredits} credits
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-white p-3 rounded-md border border-purple-100">
                <p className="font-medium mb-1">Credit Calculation:</p>
                <p>• 1 credit = 5 days of work</p>
                <p>
                  • Credits are calculated by rounding down to the nearest
                  multiple of 5
                </p>
                <p>
                  • Example: 19 days = 3 credits (15 days), 21 days = 4 credits
                  (20 days)
                </p>
              </div>
            </div>
          </div>
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
