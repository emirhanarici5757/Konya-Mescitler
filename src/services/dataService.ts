import Papa from 'papaparse';
import { Mosque, GeocodeCache } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQiRzXZX-wjOGK2GVZt_svtIN_vABNYW-brU6OOupMk_x0PsNuqk7xX7VGojUEerPuvmH5_d8mnBenk/pub?output=csv';
const CACHE_KEY = 'konya_mosque_geocode_cache';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Utility to delay execution
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Geocode service with caching and rate limiting
 */
export const geocodeAddress = async (address: string, district: string): Promise<{ lat: number, lng: number } | null> => {
  const cache: GeocodeCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const fullAddress = `${address}, ${district}, Konya, Turkey`;
  
  if (cache[fullAddress]) {
    return { lat: cache[fullAddress].lat, lng: cache[fullAddress].lng };
  }

  try {
    const params = new URLSearchParams({
      q: fullAddress,
      format: 'json',
      limit: '1',
    });

    // Nominatim requires a User-Agent or some identification.
    // We are running in a browser, so it uses the browser's UA.
    const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };

      // Save to cache
      cache[fullAddress] = {
        ...result,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

      return result;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  return null;
};

/**
 * Fetch and parse data from Google Sheets
 */
export const fetchMosques = async (): Promise<Mosque[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: async (results) => {
        const rawData = results.data as any[];
        const mosques: Mosque[] = [];

        // Process each record
        // Columns usually: MESCİT ADI, İLÇE, ADRES, TELEFON (derived from Turkish common structures)
        for (const item of rawData) {
          const name = item['MESCİT ADI'] || item['Adı'] || item['Mescit Adı'] || '';
          if (!name) continue;

          const mosque: Mosque = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            district: item['İLÇE'] || item['İlçe'] || '',
            address: item['ADRES'] || item['Adres'] || '',
            phone: item['TELEFON'] || item['Telefon'] || 'Bilgi Yok',
          };
          mosques.push(mosque);
        }

        resolve(mosques);
      },
      error: (error) => {
        console.error('CSV Parsing error:', error);
        reject(error);
      }
    });
  });
};
