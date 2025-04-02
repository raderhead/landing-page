
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WebhookLogsProps } from "./types";

const WebhookLogs = ({ webhookLogs }: WebhookLogsProps) => {
  return (
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
  );
};

export default WebhookLogs;
