// Location coordinate type
export interface Coordinates {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  }
  
  // Crew member type
  export interface CrewMember {
    name: string;
    role: string;
  }
  
  // Dimensions type
  export interface Dimensions {
    length: string;
    width: string;
    height: string;
  }
  
  // Pricing structure
  export interface YachtPricing {
    sailing: number;  // Price per hour for sailing
    still: number;   // Price per hour when stationary
  }
  
  // Main yacht creation interface
  export interface CreateYachtRequest {
    // Basic information
    name: string;                    // Name of the yacht
    YachtType: string;              // Category (luxury, sport, fishing, sailing)
    description: string;            // Brief description of the yacht
    
    // Location details
    pickupat: string;              // Pickup location name
    location: Coordinates;         // Geographical coordinates
    
    // Capacity and measurements
    capacity: number;              // Maximum passenger capacity
    crewCount: string;            // Number of crew members
    crews?: CrewMember[];         // Optional crew details
    
    // Specifications
    mnfyear?: number;             // Manufacturing year
    dimensions: Dimensions;        // Length, width, height
    dimension?: string;           // Combined dimensions string (e.g., "30x10x15")
    
    // Features and amenities
    uniqueFeatures: string;       // Special features
    amenities: string[];          // List of amenities
    
    // Pricing
    price: YachtPricing;
    
    // Availability
    availability: boolean;        // Whether the yacht is available
    availabilityFrom: string;    // Start time of availability (ISO string)
    availabilityTo: string;      // End time of availability (ISO string)
    
    // Media
    images: string[];            // Array of image URLs
  }
  
  // API response interface
  export interface CreateYachtResponse {
    success: boolean;
    message: string;
    data?: {
      yacht: CreateYachtRequest & { _id: string };
      createdAt: string;
      updatedAt: string;
    };
  }
  
  // Error response interface
  export interface CreateYachtError {
    success: false;
    message: string;
    errors?: {
      [key: string]: string[];
    };
  }
  
  // Combined response type
  export type CreateYachtResult = CreateYachtResponse | CreateYachtError;