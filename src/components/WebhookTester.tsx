
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Plus, Minus, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WebhookTester = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [useCustomPayload, setUseCustomPayload] = useState(false);
  const [webhookType, setWebhookType] = useState<string>("receive-webhook");
  const [customPayload, setCustomPayload] = useState('{\n  "title": "Downtown Office Building",\n  "address": "123 Main St, Abilene, TX",\n  "type": "Office",\n  "size": "3,500 sq ft",\n  "price": "$750,000",\n  "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",\n  "description": "Prime office space in downtown Abilene",\n  "featured": true\n}');
  const [isPostmanMode, setIsPostmanMode] = useState(false);
  
  // Generate the full webhook URL for the user to copy
  const baseUrl = window.location.origin;
  const supabaseProjectId = "xfmguaamogzirnnqktwz";
  const fullWebhookUrl = `https://${supabaseProjectId}.supabase.co/functions/v1/${webhookType}${webhookUrl ? `/${webhookUrl}` : ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullWebhookUrl);
    toast({
      title: "URL Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  // Create sample payloads with valid address field
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

  // Sample property details payload
  const samplePropertyDetailsPayload = {
    address: "123 Main St, Abilene, TX",
    listPrice: "$750,000",
    salePricePerSqm: "$214.29",
    status: "Active",
    propertySize: "3,500 sq ft",
    landSize: "0.5 acres",
    rooms: { 
      offices: 4, 
      bathrooms: 2, 
      conferenceRooms: 1 
    },
    remarks: "Prime office space in downtown Abilene with excellent visibility",
    listingBy: "Abilene Commercial Real Estate"
  };

  useEffect(() => {
    // Update the custom payload when the webhook type changes
    if (webhookType === "receive-property-details") {
      setCustomPayload(JSON.stringify(samplePropertyDetailsPayload, null, 2));
    } else {
      setCustomPayload(JSON.stringify(samplePropertyPayload, null, 2));
    }
  }, [webhookType]);

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
        payloadToSend = webhookType === "receive-property-details" 
          ? samplePropertyDetailsPayload 
          : samplePropertyPayload;
      }
      
      // Check if address is present
      if (!payloadToSend.address) {
        toast({
          title: "Missing Address",
          description: "The payload must include an 'address' field",
          variant: "destructive",
        });
        return;
      }
      
      // Log the payload to help debugging
      console.log("Sending webhook to:", fullWebhookUrl);
      console.log("With payload:", payloadToSend);
      
      // Set the proper headers for the request
      const headers = {
        "Content-Type": "application/json"
      };
      
      // This is just for testing - sending a webhook to our own endpoint
      const response = await fetch(fullWebhookUrl, {
        method: "POST",
        headers,
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
          : `Error sending webhook: ${result.message || result.error}`,
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

  const getPostmanInstructions = () => {
    return (
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
          JSON.stringify(webhookType === "receive-property-details" 
            ? samplePropertyDetailsPayload 
            : samplePropertyPayload, null, 2)
        }</pre>
        <div className="text-amber-500 flex items-center mt-3">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Make sure the <strong>address</strong> field matches a property in your database!</span>
        </div>
      </div>
    );
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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
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
              {webhookType === "receive-property-details" ? (
                <span>Property Details webhooks require an <code className="bg-amber-500/10 p-1 rounded-sm">address</code> field that matches an existing property.</span>
              ) : (
                <span>Property Listing webhooks require at least an <code className="bg-amber-500/10 p-1 rounded-sm">address</code> field.</span>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <div className="flex items-center justify-between w-full">
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setUseCustomPayload(!useCustomPayload)}
              >
                {useCustomPayload ? "Use Sample Payload" : "Use Custom Payload"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsPostmanMode(!isPostmanMode)}
              >
                {isPostmanMode ? "Hide Postman Guide" : "Postman Guide"}
              </Button>
            </div>
            <Button onClick={generateTestWebhook}>
              Send Test {webhookType === "receive-property-details" ? "Property Details" : "Property Listing"}
            </Button>
          </div>
          
          {isPostmanMode && (
            <Card className="w-full bg-muted/40 border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Postman Guide</CardTitle>
                <CardDescription>How to test with Postman</CardDescription>
              </CardHeader>
              <CardContent>
                {getPostmanInstructions()}
              </CardContent>
            </Card>
          )}
          
          {useCustomPayload && !isPostmanMode && (
            <div className="w-full">
              <Textarea 
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="font-mono text-sm h-[200px]"
                placeholder="Enter custom JSON payload"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter a valid JSON with property data. Must include an "address" field.
              </p>
            </div>
          )}
          
          {!useCustomPayload && !isPostmanMode && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sample-payload">
                <AccordionTrigger>View Sample Payload</AccordionTrigger>
                <AccordionContent>
                  <pre className="p-3 bg-muted rounded-md text-xs overflow-auto">
                    {JSON.stringify(
                      webhookType === "receive-property-details" 
                        ? samplePropertyDetailsPayload 
                        : samplePropertyPayload, 
                      null, 
                      2
                    )}
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
