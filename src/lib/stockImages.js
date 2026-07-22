// 100% Verified Standard EXIM Commodity Stock Image Catalog

export const EXIM_COMMODITY_CATALOG = [
  {
    title: 'Sugar',
    keywords: ['sugar', 'cane', 'white sugar', 'raw sugar'],
    url: 'https://images.unsplash.com/photo-1622484210800-8851843d4586?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Mangoes',
    keywords: ['mango', 'mangoes', 'alphonso', 'fruit'],
    url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Black Pepper',
    keywords: ['black pepper', 'pepper', 'peppercorn'],
    url: 'https://images.unsplash.com/photo-1509358271058-acd02cc93898?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Basmati Rice',
    keywords: ['rice', 'basmati', 'grain'],
    url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Assorted Spices',
    keywords: ['spices', 'turmeric', 'chilli', 'cardamom', 'cumin'],
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Shipping Containers',
    keywords: ['container', 'containers', 'port', 'terminal', 'logistics', 'ship'],
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Textiles & Fabrics',
    keywords: ['textile', 'fabric', 'cotton', 'yarn', 'silk', 'garment', 'apparel'],
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Industrial Machinery',
    keywords: ['machinery', 'machine', 'equipment', 'industrial', 'factory'],
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Get verified high-resolution EXIM commodity image for query.
 */
export function getStockImageUrl(query) {
  if (!query || !query.trim()) {
    return EXIM_COMMODITY_CATALOG[0].url;
  }

  const clean = query.trim().toLowerCase();

  // Search in our verified core commodities
  const match = EXIM_COMMODITY_CATALOG.find(item => 
    item.title.toLowerCase().includes(clean) ||
    item.keywords.some(k => clean.includes(k) || k.includes(clean))
  );

  if (match) {
    return match.url;
  }

  // Fallback to verified containers photo
  return EXIM_COMMODITY_CATALOG[5].url;
}
