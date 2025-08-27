"use client"

import { Step1Basics } from "./steps/step-1-basics"
import { Step2Functional } from "./steps/step-2-functional"
import { Step3Technical } from "./steps/step-3-technical"
import { Step4Deliverables } from "./steps/step-4-deliverables"
import { Step5Releases } from "./steps/step-5-releases"
import { useProjectForm } from "./form-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

const steps = [
  { title: "Project Basics", description: "Basic project information" },
  { title: "Functional Requirements", description: "What your project should do" },
  { title: "Technical Details", description: "Technical requirements and deliverables" },
  { title: "Deliverables", description: "Define your project deliverables" },
  { title: "Review & Submit", description: "Review and submit your project" },
]

export function ProjectForm() {
  const { currentStep, totalSteps } = useProjectForm()

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Basics />
      case 1:
        return <Step2Functional />
      case 2:
        return <Step3Technical />
      case 3:
        return <Step4Deliverables />
      case 4:
        return <Step5Releases />
      default:
        return <Step1Basics />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>Project Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2">
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    ) : index === currentStep ? (
                      <Circle className="h-5 w-5 text-purple-600 fill-current" />
                    ) : (
                      <Circle className="h-5 w-5 text-purple-400" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && <div className="w-16 h-px bg-gray-300 mx-4 mt-[-20px]" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="border-purple-300 text-purple-700">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      {renderStep()}
    </div>
  )
}
