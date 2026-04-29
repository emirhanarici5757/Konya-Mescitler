import Papa from 'papaparse';
import { Mosque } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQiRzXZX-wjOGK2GVZt_svtIN_vABNYW-brU6OOupMk_x0PsNuqk7xX7VGojUEerPuvmH5_d8mnBenk/pub?output=csv';

/**
 * Fetch and parse data from Google Sheets
 * The spreadsheet has: Title, Content, Lat, Lon
 */
export const fetchMosques = async (): Promise<Mosque[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as any[];
        const mosques: Mosque[] = [];

        console.log('CSV Raw Data Sample:', rawData.slice(0, 2));

        for (const item of rawData) {
          const name = item['Title'] || item['title'] || '';
          const lat = parseFloat(item['Lat'] || item['lat']);
          const lng = parseFloat(item['Lon'] || item['lon'] || item['lng'] || item['Lng']);
          
          if (!name || isNaN(lat) || isNaN(lng)) continue;

          // Extracting some info from HTML content if possible, or just keeping it raw
          const content = item['Content'] || item['content'] || '';

          const mosque: Mosque = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            description: content,
            lat: lat,
            lng: lng,
            // Since district/phone are not explicitly in separate columns in this CSV, we might need to parse Content 
            // but for now let's use what we have.
            district: 'Konya', 
            address: 'Konya Merkez',
            phone: 'Bilgi Yok'
          };
          mosques.push(mosque);
        }

        console.log(`Parsed ${mosques.length} mosques`);
        resolve(mosques);
      },
      error: (error) => {
        console.error('CSV Parsing error:', error);
        reject(error);
      }
    });
  });
};
