
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import WebhookUrlManager from "./WebhookUrlManager";
import WebhookPayloadEditor from "./WebhookPayloadEditor";
import WebhookLogs from "./WebhookLogs";
import { WebhookLog } from "./types";
import { useWebhookSamples } from "./hooks/useWebhookSamples";

const WebhookTester = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [useCustomPayload, setUseCustomPayload] = useState(false);
  const [webhookType, setWebhookType] = useState<string>("receive-webhook");
  const [customPayload, setCustomPayload] = useState('');
  const [isPostmanMode, setIsPostmanMode] = useState(false);
  const [syncMode, setSyncMode] = useState(false);
  
  const { 
    samplePropertyPayload,
    samplePropertiesArrayPayload,
    samplePropertyDetailsPayload,
    getInitialCustomPayload
  } = useWebhookSamples();
  
  // Generate the full webhook URL for the user to copy
  const baseUrl = window.location.origin;
  const supabaseProjectId = "xfmguaamogzirnnqktwz";
  const effectiveWebhookType = syncMode ? "sync-properties" : webhookType;
  const fullWebhookUrl = `https://${supabaseProjectId}.supabase.co/functions/v1/${effectiveWebhookType}${webhookUrl ? `/${webhookUrl}` : ''}`;

  // Handle URL copy
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullWebhookUrl);
    toast({
      title: "URL Copied",
      description: "Webhook URL copied to clipboard",
    });
  };

  // Initialize custom payload based on webhook type
  useState(() => {
    setCustomPayload(getInitialCustomPayload(webhookType, syncMode));
  });

  // Generate and send test webhook
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
        if (syncMode) {
          payloadToSend = samplePropertiesArrayPayload;
        } else {
          payloadToSend = webhookType === "receive-property-details" 
            ? samplePropertyDetailsPayload 
            : samplePropertyPayload;
        }
      }
      
      // Check if address is present
      if (!syncMode && !payloadToSend.address) {
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
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbWd1YWFtb2d6aXJubnFrdHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjMxMzMsImV4cCI6MjA1NzEzOTEzM30.OjoZDtrxo7z2Xa2fQ4_FSKISQehuSNx3UbHKjfFzNxg"
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
          ? syncMode 
            ? `Sync completed: Processed ${result.processedCount} properties, deleted ${result.deletedCount} stale properties.` 
            : "Property data sent successfully! Check the Featured Properties section."
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

  return (
    <div className="space-y-6">
      <WebhookUrlManager 
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        webhookType={webhookType}
        setWebhookType={setWebhookType}
        syncMode={syncMode}
        setSyncMode={setSyncMode}
        fullWebhookUrl={fullWebhookUrl}
        copyToClipboard={copyToClipboard}
        effectiveWebhookType={effectiveWebhookType}
      />
      
      <WebhookPayloadEditor
        useCustomPayload={useCustomPayload}
        setUseCustomPayload={setUseCustomPayload}
        isPostmanMode={isPostmanMode}
        setIsPostmanMode={setIsPostmanMode}
        customPayload={customPayload}
        setCustomPayload={setCustomPayload}
        syncMode={syncMode}
        webhookType={webhookType}
        generateTestWebhook={generateTestWebhook}
        fullWebhookUrl={fullWebhookUrl}
        samplePropertyPayload={samplePropertyPayload}
        samplePropertiesArrayPayload={samplePropertiesArrayPayload}
        samplePropertyDetailsPayload={samplePropertyDetailsPayload}
      />
      
      <WebhookLogs webhookLogs={webhookLogs} />
    </div>
  );
};

export default WebhookTester;
