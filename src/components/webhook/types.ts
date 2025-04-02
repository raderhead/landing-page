
// Define types for all webhook related components

export interface WebhookLog {
  id: number;
  timestamp: string;
  success: boolean;
  data: any;
  payload: any;
}

export interface SamplePropertyPayload {
  title: string;
  address: string;
  type: string;
  size: string;
  price: string;
  image_url: string;
  description: string;
  featured: boolean;
}

export interface SamplePropertyDetailsPayload {
  address: string;
  listPrice: string;
  salePricePerSqm: string;
  status: string;
  propertySize: string;
  landSize: string;
  rooms: {
    offices: number;
    bathrooms: number;
    conferenceRooms: number;
  };
  remarks: string;
  listingBy: string;
  virtualtour: string[];
}

export interface SamplePropertiesArrayPayload {
  properties: Array<{
    title: string;
    address: string;
    type: string;
    size: string;
    price: string;
    image_url: string;
  }>;
}

export interface WebhookUrlManagerProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  webhookType: string;
  setWebhookType: (type: string) => void;
  syncMode: boolean;
  setSyncMode: (mode: boolean) => void;
  fullWebhookUrl: string;
  copyToClipboard: () => void;
  effectiveWebhookType: string;
}

export interface WebhookPayloadEditorProps {
  useCustomPayload: boolean;
  setUseCustomPayload: (use: boolean) => void;
  isPostmanMode: boolean;
  setIsPostmanMode: (mode: boolean) => void;
  customPayload: string;
  setCustomPayload: (payload: string) => void;
  syncMode: boolean;
  webhookType: string;
  generateTestWebhook: () => Promise<void>;
  fullWebhookUrl: string;
  samplePropertyPayload: SamplePropertyPayload;
  samplePropertiesArrayPayload: SamplePropertiesArrayPayload;
  samplePropertyDetailsPayload: SamplePropertyDetailsPayload;
}

export interface WebhookLogsProps {
  webhookLogs: WebhookLog[];
}
