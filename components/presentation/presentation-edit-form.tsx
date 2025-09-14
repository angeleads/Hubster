import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import React from "react";

type FormData = {
  title: string;
  description: string;
  eventType: string;
  preferredDate: string;
  preferredStartTime: string;
  preferredEndTime: string;
  location: string;
  file: File | null;
};

type Props = {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function PresentationEditForm({
  formData,
  onChange,
  onSelectChange,
  onFileChange,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  return (
    <Card className="bg-white border-purple-800">
      <CardHeader>
        <CardTitle className="text-gray-900">Edit Presentation</CardTitle>
        <CardDescription className="text-slate-400">Update your presentation details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-black">
              Presentation Type
            </Label>
            <Select
              value={formData.eventType}
              onValueChange={(value) => onSelectChange("eventType", value)}
              required
            >
              <SelectTrigger className="bg-white border-slate-700 text-black">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="talk">Talk</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-black">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Enter presentation title"
              className="bg-white border-slate-700 text-black"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-black">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Describe your presentation"
              rows={4}
              className="bg-white border-slate-700 text-black"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-black">
                Preferred Date
              </Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={onChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-white border-slate-700 text-black"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-black">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={onChange}
                placeholder="Enter location"
                className="bg-white border-slate-700 text-black"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredStartTime" className="text-black">
                Start Time
              </Label>
              <Input
                id="preferredStartTime"
                name="preferredStartTime"
                type="time"
                value={formData.preferredStartTime}
                onChange={onChange}
                className="bg-white border-slate-700 text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredEndTime" className="text-black">
                End Time
              </Label>
              <Input
                id="preferredEndTime"
                name="preferredEndTime"
                type="time"
                value={formData.preferredEndTime}
                onChange={onChange}
                className="bg-white border-slate-700 text-black"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-black">
              Attach File (optional)
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={onFileChange}
              className="bg-white border-slate-700 text-black"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-purple-200 text-purple-400 hover:bg-purple-400 hover:text-purple-600" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button className=" text-red-600 hover:bg-red-200 hover:text-red-900" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
