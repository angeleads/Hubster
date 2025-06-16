import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";

type AdminPresentationDetailProps = {
  event: {
    id: string;
    description: string;
    file_url?: string | null;
  };
};

export default function AdminPresentationDetailCard({
  event,
}: AdminPresentationDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presentation Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700">{event.description}</p>
        </div>

        {event.file_url && (
          <div>
            <h3 className="font-medium mb-2">Attached File</h3>
            <a
              href={event.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-purple-600 hover:underline"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Presentation File
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <a
              href={event.file_url}
              download
              className="flex items-center text-blue-600 hover:underline mt-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
