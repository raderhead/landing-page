
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sampleProperty = {
  address: "123 Main St, Abilene, TX 79601",
  mls: "MLS123456",
  price: "$450,000",
  image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
};

const samplePropertiesList = [
  {
    address: "456 Oak Ave, Abilene, TX 79602",
    mls: "MLS789012",
    price: "$350,000",
    image_url: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    address: "789 Pine St, Abilene, TX 79603",
    mls: "MLS345678",
    price: "$275,000",
    image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const WebhookTester = () => {
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  
  const sendWebhook = async (data: any) => {
    setLoading(true);
    try {
      const projectId = "xfmguaamogzirnnqktwz";
      const webhookUrl = `https://${projectId}.supabase.co/functions/v1/receive-webhook`;
      
      console.log("Sending webhook to:", webhookUrl);
      console.log("Data:", data);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use anon key for testing since we're simulating an external service
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbWd1YWFtb2d6aXJubnFrdHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NjMxMzMsImV4cCI6MjA1NzEzOTEzM30.OjoZDtrxo7z2Xa2fQ4_FSKISQehuSNx3UbHKjfFzNxg"
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      console.log("Webhook response:", result);
      
      if (response.ok) {
        toast({
          title: "Webhook Sent Successfully",
          description: "The properties have been added to the database."
        });
      } else {
        throw new Error(result.error || "Failed to send webhook");
      }
    } catch (error) {
      console.error("Error sending webhook:", error);
      toast({
        title: "Error Sending Webhook",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestSingle = () => {
    sendWebhook(sampleProperty);
  };
  
  const handleTestMultiple = () => {
    sendWebhook(samplePropertiesList);
  };
  
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData);
      sendWebhook(parsedData);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON data",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Webhook Tester</CardTitle>
        <CardDescription>
          Use this tool to test sending property data to the webhook endpoint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predefined">
          <TabsList className="mb-4">
            <TabsTrigger value="predefined">Predefined Samples</TabsTrigger>
            <TabsTrigger value="custom">Custom JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predefined" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={handleTestSingle} 
                disabled={loading}
                variant="outline"
              >
                Test Single Property
              </Button>
              <Button 
                onClick={handleTestMultiple} 
                disabled={loading}
                variant="outline"
              >
                Test Multiple Properties
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <Textarea
                placeholder="Paste your JSON data here..."
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Custom Webhook"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Your webhook endpoint: <code className="bg-muted px-1 py-0.5 rounded">/functions/v1/receive-webhook</code>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Properties need: address, mls, price, and image_url fields.
        </p>
      </CardFooter>
    </Card>
  );
};

export default WebhookTester;
