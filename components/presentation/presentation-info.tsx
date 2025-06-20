import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User } from "lucide-react";

type Props = {
  event: any;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
};

export function PresentationInfo({ event, formatDate, formatTime }: Props) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-slate-300">
              {formatDate(event.start_date)}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-slate-300">
              {formatTime(event.start_date)} - {formatTime(event.end_date)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-slate-300">{event.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Presenter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-slate-300">{event.presenter_name}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Status Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-slate-400">
            <p>Created: {new Date(event.created_at).toLocaleDateString()}</p>
            <p>
              Last Updated: {new Date(event.updated_at).toLocaleDateString()}
            </p>
          </div>
          {event.status === "pending" && (
            <p className="text-sm text-amber-400">
              Your presentation is awaiting admin approval.
            </p>
          )}
          {event.status === "approved" && (
            <p className="text-sm text-emerald-400">
              Your presentation has been approved!
            </p>
          )}
          {event.status === "rejected" && (
            <p className="text-sm text-red-400">
              Your presentation was rejected. You can edit and resubmit it
              above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
