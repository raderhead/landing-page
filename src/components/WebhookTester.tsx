
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WebhookTester = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [useCustomPayload, setUseCustomPayload] = useState(false);
  const [customPayload, setCustomPayload] = useState('{\n  "title": "Downtown Office Building",\n  "address": "123 Main St, Abilene, TX",\n  "type": "Office",\n  "size": "3,500 sq ft",\n  "price": "$750,000",\n  "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",\n  "description": "Prime office space in downtown Abilene",\n  "featured": true\n}');
  
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

  // Sample property listing payload
  const samplePropertyPayload = {
    title: "Downtown Office Building",
    address: "123 Main St, Abilene, TX",
    type: "Office",
    size: "3,500 sq ft",
    price: "$750,000",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Prime office space in downtown Abilene",
    featured: true
  };

  const generateTestWebhook = async () => {
    try {
      let payloadToSend;
      
      if (useCustomPayload) {
        try {
          payloadToSend = JSON.parse(customPayload);
        } catch (err) {
          toast({
            title: "Invalid JSON",
            description: "Please check your JSON format and try again",
            variant: "destructive",
          });
          return;
        }
      } else {
        payloadToSend = samplePropertyPayload;
      }
      
      // Log the payload to help debugging
      console.log("Sending webhook to:", fullWebhookUrl);
      console.log("With payload:", payloadToSend);
      
      // This is just for testing - sending a webhook to our own endpoint
      const response = await fetch(fullWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadToSend),
      });
      
      const result = await response.json();
      setWebhookLogs(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          success: result.success,
          data: result,
          payload: payloadToSend
        },
        ...prev
      ]);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.success 
          ? "Property data sent successfully! Check the Featured Properties section." 
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
            Use this URL to receive property listing webhooks from external services
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
        <CardFooter className="flex flex-col items-start space-y-4">
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              onClick={() => setUseCustomPayload(!useCustomPayload)}
              className="mr-2"
            >
              {useCustomPayload ? "Use Sample Payload" : "Use Custom Payload"}
            </Button>
            <Button onClick={generateTestWebhook}>
              Send Test Property Listing
            </Button>
          </div>
          
          {useCustomPayload && (
            <div className="w-full">
              <Textarea 
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="font-mono text-sm h-[200px]"
                placeholder="Enter custom JSON payload"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter a valid JSON with property data. Must include at least a "title" field.
              </p>
            </div>
          )}
          
          {!useCustomPayload && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sample-payload">
                <AccordionTrigger>View Sample Payload</AccordionTrigger>
                <AccordionContent>
                  <pre className="p-3 bg-muted rounded-md text-xs overflow-auto">
                    {JSON.stringify(samplePropertyPayload, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
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
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="payload">
                        <AccordionTrigger>Sent Payload</AccordionTrigger>
                        <AccordionContent>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="response">
                        <AccordionTrigger>Response</AccordionTrigger>
                        <AccordionContent>
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
