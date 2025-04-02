
import { useState, useEffect } from 'react';
import { SamplePropertyPayload, SamplePropertyDetailsPayload, SamplePropertiesArrayPayload } from '../types';

export const useWebhookSamples = () => {
  // Create sample payloads with valid address field
  const samplePropertyPayload: SamplePropertyPayload = {
    title: "Downtown Office Building",
    address: "123 Main St, Abilene, TX",
    type: "Office",
    size: "3,500 sq ft",
    price: "$750,000",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Prime office space in downtown Abilene",
    featured: true
  };

  // Sample properties array for sync mode
  const samplePropertiesArrayPayload: SamplePropertiesArrayPayload = {
    properties: [
      {
        title: "Downtown Office Building",
        address: "123 Main St, Abilene, TX",
        type: "Office",
        size: "3,500 sq ft",
        price: "$750,000",
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
      },
      {
        title: "Retail Space on Pine",
        address: "456 Pine Ave, Abilene, TX",
        type: "Retail",
        size: "2,200 sq ft",
        price: "$450,000",
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
      },
      {
        title: "Industrial Warehouse",
        address: "789 Industrial Pkwy, Abilene, TX",
        type: "Industrial",
        size: "12,000 sq ft",
        price: "$1,200,000",
        image_url: "https://images.unsplash.com/photo-1553413077-190dd305871c"
      }
    ]
  };

  // Sample property details payload
  const samplePropertyDetailsPayload: SamplePropertyDetailsPayload = {
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
    listingBy: "Abilene Commercial Real Estate",
    virtualtour: ["https://my.matterport.com/show/?m=example", "https://www.youtube.com/watch?v=example"]
  };

  // Helper to get the initial custom payload based on webhook type and sync mode
  const getInitialCustomPayload = (webhookType: string, syncMode: boolean) => {
    if (syncMode) {
      return JSON.stringify(samplePropertiesArrayPayload, null, 2);
    } else if (webhookType === "receive-property-details") {
      return JSON.stringify(samplePropertyDetailsPayload, null, 2);
    } else {
      return JSON.stringify(samplePropertyPayload, null, 2);
    }
  };

  return {
    samplePropertyPayload,
    samplePropertiesArrayPayload,
    samplePropertyDetailsPayload,
    getInitialCustomPayload
  };
};
