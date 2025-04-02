
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WebhookPayloadEditorProps } from "./types";
import { RefreshCw } from "lucide-react";
import WebhookPostmanGuide from "./WebhookPostmanGuide";

const WebhookPayloadEditor = ({ 
  useCustomPayload,
  setUseCustomPayload,
  isPostmanMode,
  setIsPostmanMode,
  customPayload,
  setCustomPayload,
  syncMode,
  webhookType,
  generateTestWebhook,
  fullWebhookUrl,
  samplePropertyPayload,
  samplePropertiesArrayPayload,
  samplePropertyDetailsPayload
}: WebhookPayloadEditorProps) => {
  
  // Determine which sample payload to show based on current settings
  const currentSamplePayload = syncMode
    ? samplePropertiesArrayPayload
    : webhookType === "receive-property-details" 
      ? samplePropertyDetailsPayload 
      : samplePropertyPayload;

  return (
    <Card>
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
            {syncMode ? (
              <span className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Properties
              </span>
            ) : (
              `Send Test ${webhookType === "receive-property-details" ? "Property Details" : "Property Listing"}`
            )}
          </Button>
        </div>
        
        {isPostmanMode && (
          <WebhookPostmanGuide 
            fullWebhookUrl={fullWebhookUrl}
            syncMode={syncMode}
            webhookType={webhookType}
            samplePayload={currentSamplePayload}
          />
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
              {syncMode 
                ? "Enter a valid JSON with an array of properties in the 'properties' field." 
                : "Enter a valid JSON with property data. Must include an \"address\" field."}
            </p>
          </div>
        )}
        
        {!useCustomPayload && !isPostmanMode && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sample-payload">
              <AccordionTrigger>View Sample Payload</AccordionTrigger>
              <AccordionContent>
                <pre className="p-3 bg-muted rounded-md text-xs overflow-auto">
                  {JSON.stringify(currentSamplePayload, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardFooter>
    </Card>
  );
};

export default WebhookPayloadEditor;
