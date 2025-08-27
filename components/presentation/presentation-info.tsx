import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  User,
  CircleCheckBig,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  event: any;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
};

export function PresentationInfo({ event, formatDate, formatTime }: Props) {
const [presenterName, setPresenterName] = useState("Unknown Presenter")

  useEffect(() => {
    async function fetchPresenterName() {
      if (!event?.presenter_id) return
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", event.presenter_id)
        .single()
      if (data && data.full_name) {
        setPresenterName(data.full_name)
      }
    }
    fetchPresenterName()
  }, [event?.presenter_id])
  return (
    <div className="space-y-6">
      <Card className="bg-white border-purple-400 border-2">
        <CardHeader>
          <CardTitle className="text-black">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-slate-900" />
            <span className="text-slate-700">
              {formatDate(event.start_date)}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-slate-900" />
            <span className="text-slate-800">
              {formatTime(event.start_date)} - {formatTime(event.end_date)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-slate-900" />
            <span className="text-slate-800">{event.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-purple-400 border-2">
        <CardHeader>
          <CardTitle className="text-black">Presenter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-slate-900" />
            <span className="text-slate-800">{presenterName}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-purple-400 border-2">
        <CardHeader>
          <CardTitle className="text-black">Status Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-slate-900">
            <p>Created: {new Date(event.created_at).toLocaleDateString()}</p>
            <p>
              Last Updated: {new Date(event.updated_at).toLocaleDateString()}
            </p>
          </div>
          <div className="pt-4">

            {event.status === "pending" && (
              <div>
                <p className="text-lg font-bold text-amber-400">
                  <Clock className="inline h-5 w-5 mr-1" />
                  Your presentation is awaiting the HUB manager's approval.
                </p>
              </div>
            )}
            {event.status === "approved" && (
              <div>
                <p className="text-lg font-bold text-emerald-400">
                  <CircleCheckBig className="inline h-5 w-5 mr-1" />
                  Your presentation has been approved!
                </p>
                <span className="text-gray-800 font-bold">
                  Comment: "{event.admin_feedback}"
                </span>
              </div>
            )}
            {event.status === "rejected" && (
              <div>
                <XCircle className="inline h-5 w-5 mr-1 text-red-400" />
                <span className="text-lg font-bold text-red-400">
                  Your presentation was rejected.
                </span>
                <span className="text-gray-800 font-bold">
                  Comment: "{event.admin_feedback}"
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
