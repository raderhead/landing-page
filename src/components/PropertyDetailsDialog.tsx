import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Home, Info, DollarSign, MapPin, SquareUser, Table, Ruler } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Json } from '@/integrations/supabase/types';

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
            listingBy: detailsData.listingby
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-luxury-black border-luxury-gold/20">
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
          <>
            <div className="relative w-full h-[40vh] overflow-hidden">
              {property?.image_url ? (
                <img 
                  src={property.image_url} 
                  alt={property.title || 'Property'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-luxury-dark/50 flex items-center justify-center">
                  <Home className="h-16 w-16 text-luxury-gold/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black to-transparent"></div>
            </div>
            
            <DialogHeader className="px-6 pt-4 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-3xl font-serif text-luxury-gold mb-1">
                    {property?.price && (
                      <span className="block">
                        {property.price.startsWith('$') ? property.price : `$${property.price}`}
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xl font-medium text-white">
                    {property?.address || 'Address not available'}
                  </DialogDescription>
                  
                  {property?.type && (
                    <div className="mt-2 inline-block bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold px-2 py-1 text-xs rounded">
                      {property.type}
                    </div>
                  )}
                </div>
                
                {property?.mls && (
                  <div className="bg-luxury-dark/80 p-2 rounded border border-luxury-gold/10 text-right">
                    <p className="text-xs text-luxury-khaki/70">MLS</p>
                    <p className="font-medium text-white">{property.mls}</p>
                  </div>
                )}
              </div>
            </DialogHeader>
            
            <ScrollArea className="px-6 py-4 h-[calc(90vh-40vh-88px)]">
              <div className="space-y-6">
                {/* Basic Property Information */}
                <Card className="bg-luxury-dark border-luxury-gold/10">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-luxury-gold/70" />
                      Property Overview
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {propertyDetails?.status && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                            <Info className="h-4 w-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="text-xs text-luxury-khaki/70">Status</p>
                            <p className="font-medium text-white">{propertyDetails.status}</p>
                          </div>
                        </div>
                      )}
                      
                      {propertyDetails?.propertySize && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                            <Table className="h-4 w-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="text-xs text-luxury-khaki/70">Property Size</p>
                            <p className="font-medium text-white">{propertyDetails.propertySize}</p>
                          </div>
                        </div>
                      )}
                      
                      {propertyDetails?.landSize && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                            <Ruler className="h-4 w-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="text-xs text-luxury-khaki/70">Land Size</p>
                            <p className="font-medium text-white">{propertyDetails.landSize}</p>
                          </div>
                        </div>
                      )}
                      
                      {propertyDetails?.listPrice && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                            <DollarSign className="h-4 w-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="text-xs text-luxury-khaki/70">List Price</p>
                            <p className="font-medium text-white">{propertyDetails.listPrice}</p>
                          </div>
                        </div>
                      )}
                      
                      {propertyDetails?.salePricePerSqm && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                            <DollarSign className="h-4 w-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="text-xs text-luxury-khaki/70">Price Per SqM</p>
                            <p className="font-medium text-white">{propertyDetails.salePricePerSqm}</p>
                          </div>
                        </div>
                      )}
                      
                      {propertyDetails?.listingBy && (
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center mr-3">
                            <SquareUser className="h-4 w-4 text-luxury-gold" />
                          </div>
                          <div>
                            <p className="text-xs text-luxury-khaki/70">Listed By</p>
                            <p className="font-medium text-white">{propertyDetails.listingBy}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Rooms Information */}
                {propertyDetails?.rooms && Object.keys(propertyDetails.rooms).length > 0 && (
                  <Card className="bg-luxury-dark border-luxury-gold/10">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                        <Home className="h-5 w-5 mr-2 text-luxury-gold/70" />
                        Room Information
                      </h3>
                      
                      {formatRooms(propertyDetails.rooms)}
                    </CardContent>
                  </Card>
                )}
                
                {/* Remarks/Description */}
                {propertyDetails?.remarks && (
                  <Card className="bg-luxury-dark border-luxury-gold/10">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-luxury-gold/70" />
                        Description
                      </h3>
                      
                      <p className="text-luxury-khaki whitespace-pre-line">{propertyDetails.remarks}</p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Additional Information */}
                <Card className="bg-luxury-dark border-luxury-gold/10">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-luxury-gold mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-luxury-gold/70" />
                      Location
                    </h3>
                    
                    <p className="text-luxury-khaki">{propertyDetails?.address || property?.address || 'Address not available'}</p>
                    
                    {/* We could add a map here in the future */}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsDialog;
