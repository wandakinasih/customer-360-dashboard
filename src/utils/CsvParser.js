import Papa from 'papaparse';

const CsvParser = {
  parseFromUrl: async (url, options = {}) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      const defaultOptions = {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      };
      
      const parseOptions = { ...defaultOptions, ...options };
      return Papa.parse(csvText, parseOptions);
    } catch (error) {
      console.error('Error parsing CSV from URL:', error);
      throw error;
    }
  }
};

export default CsvParser;