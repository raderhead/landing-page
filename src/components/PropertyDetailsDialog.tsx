
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Home, Info, DollarSign, MapPin, SquareUser, Table, Ruler, Clock, Tag, Link as LinkIcon, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface PropertyDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string | null;
}

type PropertyDetails = {
  id: string;
  property_id: string;
  address: string | null;
  listPrice: string | null;
  salePricePerSqm: string | null;
  status: string | null;
  propertySize: string | null;
  landSize: string | null;
  rooms: Record<string, any> | null;
  remarks: string | null;
  listingBy: string | null;
  virtualtour: string[] | null;
};

type Property = {
  id: string;
  title: string | null;
  address: string | null;
  type: string | null;
  price: string | null;
  image_url: string | null;
  mls: string | null;
};

const PropertyDetailsDialog = ({ isOpen, onClose, propertyId }: PropertyDetailsDialogProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [currentVirtualTourUrl, setCurrentVirtualTourUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch basic property info
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
          
        if (propertyError) {
          throw propertyError;
        }
        
        setProperty(propertyData);
        
        // Fetch property details
        const { data: detailsData, error: detailsError } = await supabase
          .from('property_details')
          .select('*')
          .eq('property_id', propertyId)
          .maybeSingle();
          
        if (detailsError) {
          throw detailsError;
        }
        
        // Transform the data to match our PropertyDetails type
        if (detailsData) {
          // Safely convert rooms Json to Record<string, any> or null
          let roomsData: Record<string, any> | null = null;
          
          if (detailsData.rooms) {
            // If it's a string, try to parse it
            if (typeof detailsData.rooms === 'string') {
              try {
                roomsData = JSON.parse(detailsData.rooms);
              } catch (e) {
                console.error("Error parsing rooms JSON:", e);
                roomsData = null;
              }
            } else {
              // If it's already an object, use it directly
              roomsData = detailsData.rooms as Record<string, any>;
            }
          }

          // Handle virtualtour data which could be an array of urls or a single url string
          let virtualTourData: string[] | null = null;
          
          if (detailsData.virtualtour) {
            if (typeof detailsData.virtualtour === 'string') {
              try {
                // Try to parse if it's a JSON string
                virtualTourData = JSON.parse(detailsData.virtualtour);
              } catch (e) {
                // If not a valid JSON, assume it's a single URL
                virtualTourData = [detailsData.virtualtour];
              }
            } else if (Array.isArray(detailsData.virtualtour)) {
              // If it's already an array, use it directly
              virtualTourData = detailsData.virtualtour;
            }
          }
          
          const transformedDetails: PropertyDetails = {
            id: detailsData.id,
            property_id: detailsData.property_id,
            address: detailsData.address,
            listPrice: detailsData.listprice,
            salePricePerSqm: detailsData.salepricepersqm,
            status: detailsData.status,
            propertySize: detailsData.propertysize,
            landSize: detailsData.landsize,
            rooms: roomsData,
            remarks: detailsData.remarks,
            listingBy: detailsData.listingby,
            virtualtour: virtualTourData
          };
          
          setPropertyDetails(transformedDetails);
        } else {
          setPropertyDetails(null);
        }
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError("Error loading property details");
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && propertyId) {
      fetchPropertyData();
    }
  }, [isOpen, propertyId]);
  
  // Reset state when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setPropertyDetails(null);
      setProperty(null);
      setError(null);
    }
  }, [isOpen]);
  
  const formatRooms = (rooms: Record<string, any> | null) => {
    if (!rooms) return "Not specified";
    
    try {
      const roomEntries = Object.entries(rooms);
      if (roomEntries.length === 0) return "Not specified";
      
      return (
        <div className="grid grid-cols-2 gap-2">
          {roomEntries.map(([roomType, value]) => (
            <div key={roomType} className="text-sm">
              <span className="capitalize">{roomType.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
            </div>
          ))}
        </div>
      );
    } catch (e) {
      console.error("Error formatting rooms:", e);
      return "Error processing room data";
    }
  };

  const openVirtualTourPopup = (url: string) => {
    setCurrentVirtualTourUrl(url);
    setVirtualTourOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-luxury-black border-luxury-gold/20">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-luxury-gold animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Info className="h-12 w-12 text-luxury-gold/30 mb-4" />
              <h3 className="text-lg font-bold text-luxury-gold mb-2">Error Loading Details</h3>
              <p className="text-luxury-khaki">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Header with main information */}
              <div className="p-6 border-b border-luxury-gold/10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-serif text-luxury-gold mb-2">
                      {property?.price && (
                        <span>{property.price.startsWith('$') ? property.price : `$${property.price}`}</span>
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-xl font-medium text-white mb-2">
                      {property?.address || 'Address not available'}
                    </DialogDescription>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property?.type && (
                        <Badge variant="outline" className="bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20">
                          {property.type}
                        </Badge>
                      )}
                      
                      {propertyDetails?.status && (
                        <Badge variant="outline" className="bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20">
                          {propertyDetails.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {property?.mls && (
                    <div className="bg-luxury-dark/80 p-3 rounded border border-luxury-gold/10 text-right shrink-0">
                      <p className="text-xs text-luxury-khaki/70">MLS</p>
                      <p className="font-medium text-white">{property.mls}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-[calc(90vh-150px)]">
                {/* Left side - Property details (now takes 3/4 of the width) */}
                <div className="col-span-3 overflow-auto">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {/* Key Details */}
                      <Card className="bg-luxury-dark border-luxury-gold/10">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-luxury-gold flex items-center">
                              <Info className="h-5 w-5 mr-2 text-luxury-gold/70" />
                              Property Overview
                            </h3>
                            
                            {propertyDetails?.virtualtour && propertyDetails.virtualtour.length > 0 && (
                              <Button 
                                variant="gold"
                                size="sm"
                                onClick={() => openVirtualTourPopup(propertyDetails.virtualtour![0])}
                              >
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Open Virtual Tour
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-5">
                            {propertyDetails?.propertySize && (
                              <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                                  <Table className="h-5 w-5 text-luxury-gold" />
                                </div>
                                <div>
                                  <p className="text-xs text-luxury-khaki/70">Property Size</p>
                                  <p className="font-medium text-white">{propertyDetails.propertySize}</p>
                                </div>
                              </div>
                            )}
                            
                            {propertyDetails?.landSize && (
                              <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                                  <Ruler className="h-5 w-5 text-luxury-gold" />
                                </div>
                                <div>
                                  <p className="text-xs text-luxury-khaki/70">Land Size</p>
                                  <p className="font-medium text-white">{propertyDetails.landSize}</p>
                                </div>
                              </div>
                            )}
                            
                            {propertyDetails?.listPrice && (
                              <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                                  <DollarSign className="h-5 w-5 text-luxury-gold" />
                                </div>
                                <div>
                                  <p className="text-xs text-luxury-khaki/70">List Price</p>
                                  <p className="font-medium text-white">{propertyDetails.listPrice}</p>
                                </div>
                              </div>
                            )}
                            
                            {propertyDetails?.salePricePerSqm && (
                              <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                                  <Tag className="h-5 w-5 text-luxury-gold" />
                                </div>
                                <div>
                                  <p className="text-xs text-luxury-khaki/70">Price Per SqM</p>
                                  <p className="font-medium text-white">{propertyDetails.salePricePerSqm}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Virtual Tour Section - Removed from here */}
                      
                      {/* Remarks/Description */}
                      {propertyDetails?.remarks && (
                        <Card className="bg-luxury-dark border-luxury-gold/10">
                          <CardContent className="p-5">
                            <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                              <Info className="h-5 w-5 mr-2 text-luxury-gold/70" />
                              Description
                            </h3>
                            
                            <p className="text-luxury-khaki whitespace-pre-line">{propertyDetails.remarks}</p>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Rooms Information */}
                      {propertyDetails?.rooms && Object.keys(propertyDetails.rooms).length > 0 && (
                        <Card className="bg-luxury-dark border-luxury-gold/10">
                          <CardContent className="p-5">
                            <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                              <Home className="h-5 w-5 mr-2 text-luxury-gold/70" />
                              Room Information
                            </h3>
                            
                            {formatRooms(propertyDetails.rooms)}
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Additional Information */}
                      <Card className="bg-luxury-dark border-luxury-gold/10">
                        <CardContent className="p-5">
                          <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-luxury-gold/70" />
                            Location
                          </h3>
                          
                          <p className="text-luxury-khaki">{propertyDetails?.address || property?.address || 'Address not available'}</p>
                        </CardContent>
                      </Card>
                      
                      {/* Listing Information */}
                      {propertyDetails?.listingBy && (
                        <Card className="bg-luxury-dark border-luxury-gold/10 mb-6">
                          <CardContent className="p-5">
                            <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                              <SquareUser className="h-5 w-5 mr-2 text-luxury-gold/70" />
                              Listing Information
                            </h3>
                            
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                                <SquareUser className="h-5 w-5 text-luxury-gold" />
                              </div>
                              <div>
                                <p className="text-xs text-luxury-khaki/70">Listed By</p>
                                <p className="font-medium text-white">{propertyDetails.listingBy}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Right side - Image (now takes 1/4 of the width) */}
                <div className="col-span-1 border-l border-luxury-gold/10">
                  <div className="h-full w-full flex flex-col overflow-hidden bg-luxury.dark">
                    {property?.image_url ? (
                      <div className="w-full h-full flex items-center justify-center bg-luxury-dark/90 relative">
                        <img 
                          src={property.image_url} 
                          alt={property.title || 'Property'} 
                          className="w-full h-full object-contain max-h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-luxury-dark/50 flex items-center justify-center">
                        <Home className="h-16 w-16 text-luxury-gold/20" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Virtual Tour Popup Dialog */}
      <Dialog open={virtualTourOpen} onOpenChange={setVirtualTourOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-luxury-black border-luxury-gold/20">
          <div className="relative w-full h-[95vh] bg-luxury-black/90">
            {currentVirtualTourUrl && (
              <iframe 
                src={currentVirtualTourUrl} 
                title="Virtual Tour" 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-luxury-black/50 hover:bg-luxury-black/80 text-white border border-luxury-gold/20 z-10"
              onClick={() => setVirtualTourOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyDetailsDialog;
