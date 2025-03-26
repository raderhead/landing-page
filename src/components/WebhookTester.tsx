
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const WebhookTester = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [useCustomPayload, setUseCustomPayload] = useState(false);
  const [customPayload, setCustomPayload] = useState('{\n  "address": "123 Main St, Abilene, TX",\n  "mls": "20835911",\n  "price": "$750,000",\n  "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"\n}');
  
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
    address: "123 Main St, Abilene, TX",
    mls: "20835911",
    price: "$750,000",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  };

  // Sample for multiple properties
  const sampleMultiplePayload = [
    {
      address: "456 Main St, Abilene, TX",
      mls: "20816564",
      price: "$550,000",
      image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      address: "789 Industry Blvd, Abilene, TX",
      mls: "20835912",
      price: "$1,200,000",
      image_url: "https://images.unsplash.com/photo-1553335760-325a8d9e9c6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];
  
  // Sample for MLS data format
  const sampleMLSPayload = [
    {
      "address": "2600 Ivanhoe Lane, Abilene Texas, 79605 USA",
      "mls": "20835911",
      "price": "4,000,000",
      "image_url": "https://ntreis.immobel.com/img/369026/04/06/189811201_1.jpg"
    },
    {
      "address": "5265 Willow Wood Drive, Abilene Texas, 79606 USA",
      "mls": "20816564",
      "price": "2,760,000",
      "image_url": "https://ntreis.immobel.com/img/369026/14/0f/189574583_1.jpg"
    }
  ];

  const [payloadType, setPayloadType] = useState<'single' | 'multiple' | 'mls'>('single');

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
        if (payloadType === 'single') {
          payloadToSend = samplePropertyPayload;
        } else if (payloadType === 'multiple') {
          payloadToSend = sampleMultiplePayload;
        } else {
          payloadToSend = sampleMLSPayload;
        }
      }
      
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
          ? `Property data sent successfully! ${result.processed || ''} properties processed.` 
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
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setUseCustomPayload(!useCustomPayload)}
              >
                {useCustomPayload ? "Use Sample Payload" : "Use Custom Payload"}
              </Button>
              
              {!useCustomPayload && (
                <div className="flex items-center space-x-2 border-l pl-2 ml-2">
                  <Button 
                    variant={payloadType === 'single' ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => setPayloadType('single')}
                  >
                    Single Property
                  </Button>
                  <Button 
                    variant={payloadType === 'multiple' ? "secondary" : "outline"}
                    size="sm" 
                    onClick={() => setPayloadType('multiple')}
                  >
                    Multiple Properties
                  </Button>
                  <Button 
                    variant={payloadType === 'mls' ? "secondary" : "outline"}
                    size="sm" 
                    onClick={() => setPayloadType('mls')}
                  >
                    MLS Format
                  </Button>
                </div>
              )}
            </div>
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
                Enter a valid JSON with property data. Must include MLS number, address, price, and image URL.
              </p>
            </div>
          )}
          
          {!useCustomPayload && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sample-payload">
                <AccordionTrigger>View Sample Payload</AccordionTrigger>
                <AccordionContent>
                  <pre className="p-3 bg-muted rounded-md text-xs overflow-auto">
                    {JSON.stringify(
                      payloadType === 'single' 
                        ? samplePropertyPayload 
                        : payloadType === 'multiple'
                          ? sampleMultiplePayload
                          : sampleMLSPayload, 
                      null, 2
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
          <CardTitle>Property Format Guide</CardTitle>
          <CardDescription>
            Required and optional fields for property listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">address</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Full address including city and state</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">mls</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>MLS number</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">price</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>Asking price or rent</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">image_url</TableCell>
                <TableCell>Yes</TableCell>
                <TableCell>URL to the property image</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
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
