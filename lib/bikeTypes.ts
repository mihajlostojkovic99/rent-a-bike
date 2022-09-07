export const bikeTypes = [
  {
    value: 'mtb',
    label: 'Mountain bike',
  },
  {
    value: 'city',
    label: 'City',
  },
  {
    value: 'road',
    label: 'Road',
  },
  {
    value: 'xc',
    label: 'Cross country',
  },
] as const;

export const bikeTypeMap = new Map<string, string>();
bikeTypeMap.set('mtb', 'Mountain bike');
bikeTypeMap.set('city', 'City');
bikeTypeMap.set('road', 'Road');
bikeTypeMap.set('xc', 'Cross country');
