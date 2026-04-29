
export interface Mosque {
  id: string;
  name: string;
  description: string;
  district?: string;
  address?: string;
  phone?: string;
  lat: number;
  lng: number;
}

export interface GeocodeCache {
  [address: string]: {
    lat: number;
    lng: number;
    timestamp: number;
  };
}
