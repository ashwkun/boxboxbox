export const COUNTRY_CODE_MAP: { [key: string]: string } = {
  // United Kingdom variations
  'great britain': 'gb',
  'united kingdom': 'gb',
  'uk': 'gb',
  
  // United States variations
  'united states': 'us',
  'united states of america': 'us',
  'usa': 'us',
  
  // United Arab Emirates variations
  'united arab emirates': 'ae',
  'uae': 'ae',
  
  // Other countries
  'saudi arabia': 'sa',
  'korea': 'kr',
  'china': 'cn',
  'japan': 'jp',
  'italy': 'it',
  'spain': 'es',
  'monaco': 'mc',
  'canada': 'ca',
  'austria': 'at',
  'belgium': 'be',
  'netherlands': 'nl',
  'singapore': 'sg',
  'mexico': 'mx',
  'brazil': 'br',
  'australia': 'au',
  'azerbaijan': 'az',
  'bahrain': 'bh',
  'qatar': 'qa',
  'hungary': 'hu'
};

export const getCountryCode = (country: string): string => {
  const normalizedCountry = country.toLowerCase();
  return COUNTRY_CODE_MAP[normalizedCountry] || normalizedCountry;
}; 