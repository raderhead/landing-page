
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

const WebhookTester = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  
  // Generate the full webhook URL for the user to copy
  const baseUrl = window.location.origin;
  const supabaseProjectId = "xfmguaamogzirnnqktwz";
  const fullWebhookUrl = `https://${supabaseProjectId}.supabase.co/functions/v1/receive-webhook${webhookUrl ? `/${webhookUrl}` : ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullWebhookUrl);
    toast({
      title: "URL Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  const generateTestWebhook = async () => {
    try {
      // This is just for testing - sending a webhook to our own endpoint
      const response = await fetch(fullWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          message: "This is a test webhook payload"
        }),
      });
      
      const result = await response.json();
      setWebhookLogs(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          success: result.success,
          data: result
        },
        ...prev
      ]);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.success 
          ? "Test webhook sent successfully" 
          : `Error sending webhook: ${result.error}`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error sending test webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send test webhook. See console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoint</CardTitle>
          <CardDescription>
            Use this URL to receive webhooks from external services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
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
        </CardContent>
        <CardFooter>
          <Button onClick={generateTestWebhook}>
            Send Test Webhook
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Logs</CardTitle>
          <CardDescription>
            Recent webhook activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {webhookLogs.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No webhook activity yet
              </div>
            ) : (
              <div className="space-y-4">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <Badge variant={log.success ? "default" : "destructive"}>
                        {log.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookTester;
