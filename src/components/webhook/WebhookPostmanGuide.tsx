
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface WebhookPostmanGuideProps {
  fullWebhookUrl: string;
  syncMode: boolean;
  webhookType: string;
  samplePayload: any;
}

const WebhookPostmanGuide = ({ 
  fullWebhookUrl, 
  syncMode, 
  webhookType, 
  samplePayload 
}: WebhookPostmanGuideProps) => {
  return (
    <Card className="w-full bg-muted/40 border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Postman Guide</CardTitle>
        <CardDescription>How to test with Postman</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <p>1. Set the request method to <strong>POST</strong></p>
          <p>2. Use this URL:
            <code className="block p-2 mt-1 bg-muted rounded-md">{fullWebhookUrl}</code>
          </p>
          <p>3. In Headers, add:
            <code className="block p-2 mt-1 bg-muted rounded-md">Content-Type: application/json</code>
          </p>
          <p>4. In the Body tab, select "raw" and choose "JSON", then paste:</p>
          <pre className="p-2 mt-1 bg-muted rounded-md overflow-auto text-xs">{
            JSON.stringify(samplePayload, null, 2)
          }</pre>
          <div className="text-amber-500 flex items-center mt-3">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Make sure the <strong>address</strong> field matches a property in your database!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookPostmanGuide;
