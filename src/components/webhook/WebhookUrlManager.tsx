
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react"; // Correct import from lucide-react
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebhookUrlManagerProps } from "./types";

const WebhookUrlManager = ({ 
  webhookUrl, 
  setWebhookUrl, 
  webhookType, 
  setWebhookType, 
  syncMode, 
  setSyncMode,
  fullWebhookUrl,
  copyToClipboard,
  effectiveWebhookType
}: WebhookUrlManagerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Endpoint</CardTitle>
        <CardDescription>
          Use this URL to receive property listing webhooks from external services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="sync-mode"
            checked={syncMode}
            onCheckedChange={setSyncMode}
          />
          <Label htmlFor="sync-mode" className="cursor-pointer">
            Enable Sync Mode
          </Label>
          {syncMode && (
            <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
              Properties not included in payload will be deleted
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            {!syncMode && (
              <Select
                value={webhookType}
                onValueChange={setWebhookType}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select webhook type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receive-webhook">Property Listing</SelectItem>
                  <SelectItem value="receive-property-details">Property Details</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Optional custom endpoint suffix"
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-md flex items-center justify-between">
            <code className="text-sm break-all">{fullWebhookUrl}</code>
          </div>
        </div>
        
        <Alert className="bg-amber-500/10 border-amber-500/30">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Important</AlertTitle>
          <AlertDescription className="text-amber-500/90">
            {syncMode ? (
              <span>Sync Mode will delete properties that are not included in the current webhook payload.</span>
            ) : webhookType === "receive-property-details" ? (
              <span>Property Details webhooks require an <code className="bg-amber-500/10 p-1 rounded-sm">address</code> field that matches an existing property.</span>
            ) : (
              <span>Property Listing webhooks require at least an <code className="bg-amber-500/10 p-1 rounded-sm">address</code> field.</span>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
