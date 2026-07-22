import { 
  Factory, 
  Send, 
  Download, 
  ShoppingBag, 
  Truck, 
  FileCheck, 
  Briefcase, 
  Award, 
  FlaskConical, 
  Wrench, 
  GraduationCap, 
  Compass, 
  HelpCircle,
  Store,
  Handshake,
  Newspaper,
  MessageSquare
} from 'lucide-react';

export const ROLES = [
  {
    id: 'manufacturer',
    title: 'Manufacturer',
    description: 'Direct producers & factory owners supplying domestic & global trade',
    icon: Factory,
    requiresCompany: true,
  },
  {
    id: 'merchant_exporter',
    title: 'Merchant Exporter',
    description: 'Traders & exporters sourcing products to sell internationally',
    icon: Send,
    requiresCompany: true,
  },
  {
    id: 'importer',
    title: 'Importer',
    description: 'Businesses importing goods, raw materials, or equipment',
    icon: Download,
    requiresCompany: true,
  },
  {
    id: 'buying_agent',
    title: 'Buying Agent / Sourcing Company',
    description: 'Intermediaries sourcing products for international clients',
    icon: ShoppingBag,
    requiresCompany: true,
  },
  {
    id: 'freight_forwarder',
    title: 'Freight Forwarder',
    description: 'Logistics, shipping line & multi-modal transport providers',
    icon: Truck,
    requiresCompany: true,
  },
  {
    id: 'cha',
    title: 'Customs House Agent (CHA)',
    description: 'Customs clearance, port documentation & compliance agents',
    icon: FileCheck,
    requiresCompany: true,
  },
  {
    id: 'export_consultant',
    title: 'Export Consultant',
    description: 'Advisors in DGFT policies, trade finance & international compliance',
    icon: Briefcase,
    requiresCompany: true,
  },
  {
    id: 'certification_agency',
    title: 'Certification Agency',
    description: 'ISO, CE, Organic, Halal & Quality compliance certifiers',
    icon: Award,
    requiresCompany: true,
  },
  {
    id: 'testing_laboratory',
    title: 'Testing Laboratory',
    description: 'Product quality testing, chemical inspection & labs',
    icon: FlaskConical,
    requiresCompany: true,
  },
  {
    id: 'service_provider',
    title: 'Service Provider',
    description: 'Digital agencies, tech, legal, marketing & business services',
    icon: Wrench,
    requiresCompany: true,
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Students pursuing international trade, logistics & business',
    icon: GraduationCap,
    requiresCompany: false,
  },
  {
    id: 'aspiring_exporter',
    title: 'Aspiring Exporter',
    description: 'Entrepreneurs preparing to start their export-import business',
    icon: Compass,
    requiresCompany: false,
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Other EXIM ecosystem trade professionals and stakeholders',
    icon: HelpCircle,
    requiresCompany: true,
  },
];

export const NETWORKS = [
  {
    id: 'marketplace',
    title: 'Buyer & Seller Marketplace',
    subtext: 'Find buyers, suppliers, manufacturers, and business opportunities.',
    icon: Store,
    whatsappUrl: 'https://chat.whatsapp.com/Hbxjyk6YE0hLf9Pt8XPl1k',
    color: 'from-amber-500/10 to-gold-500/20 border-amber-500/30'
  },
  {
    id: 'services',
    title: 'EXIM Services',
    subtext: 'Connect with freight forwarders, CHAs, consultants, certification agencies, banks, insurance providers, and other service partners.',
    icon: Handshake,
    whatsappUrl: 'https://chat.whatsapp.com/GP9H7iXzciZ0tcPG8Oj3mw',
    color: 'from-blue-500/10 to-indigo-500/20 border-blue-500/30'
  },
  {
    id: 'news',
    title: 'EXIM News & Insights',
    subtext: 'Stay updated with export-import news, policy changes, DGFT notifications, market trends, and global trade updates.',
    icon: Newspaper,
    whatsappUrl: 'https://chat.whatsapp.com/BHxMmAJdMj30Y1FqyqTr45',
    color: 'from-emerald-500/10 to-teal-500/20 border-emerald-500/30'
  },
  {
    id: 'discussion',
    title: 'EXIM Discussion',
    subtext: 'Ask questions, share experiences, solve business challenges, and learn from fellow EXIM professionals.',
    icon: MessageSquare,
    whatsappUrl: 'https://chat.whatsapp.com/Kan62U7jTiyJHBXhVPSBbx',
    color: 'from-purple-500/10 to-violet-500/20 border-purple-500/30'
  },
];

export const COUNTRIES = [
  'India', 'United States', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom',
  'Germany', 'China', 'Vietnam', 'Bangladesh', 'Singapore', 'Malaysia', 'Netherlands',
  'Australia', 'Canada', 'Indonesia', 'Thailand', 'Italy', 'France', 'Japan',
  'South Korea', 'Brazil', 'South Africa', 'Kenya', 'Nigeria', 'Egypt', 'Turkey', 'Russia'
];

export const DYNAMIC_ROLE_CONFIG = {
  manufacturer: [
    {
      key: 'products_manufactured',
      label: 'Products You Manufacture',
      subtitle: 'Select all product categories or add custom items',
      options: ['Textiles & Apparel', 'Agricultural Goods & Spices', 'Engineering Goods', 'Chemicals & Petrochemicals', 'Pharmaceuticals', 'Handicrafts & Decor', 'Processed Foods', 'Machinery & Tools', 'Leather Products', 'Electronics'],
      allowCustom: true
    }
  ],
  merchant_exporter: [
    {
      key: 'products_exported',
      label: 'Products You Export',
      subtitle: 'Select categories you currently trade or plan to supply',
      options: ['Spices & Agricultural Products', 'Textiles & Garments', 'Engineering Components', 'Chemicals & Resins', 'Ceramics & Tiles', 'Pharmaceuticals', 'Food & Beverages', 'Jewelry & Gemstones', 'Handicrafts'],
      allowCustom: true
    },
    {
      key: 'export_markets',
      label: 'Export Markets',
      subtitle: 'Select destination countries you export to',
      options: COUNTRIES,
      allowCustom: true
    }
  ],
  importer: [
    {
      key: 'products_imported',
      label: 'Products You Import',
      subtitle: 'Select goods or raw materials you bring into your country',
      options: ['Raw Materials', 'Industrial Machinery', 'Electronics & Components', 'Chemicals & Polymers', 'Scrap Metal', 'Textile Fabrics', 'Solar Panels & Energy Equipment', 'Food Ingredients'],
      allowCustom: true
    },
    {
      key: 'import_sources',
      label: 'Import From',
      subtitle: 'Select origin countries you import from',
      options: COUNTRIES,
      allowCustom: true
    }
  ],
  buying_agent: [
    {
      key: 'products_sourced',
      label: 'Products You Source',
      subtitle: 'Select categories you source for international clients',
      options: ['Garments & Home Textiles', 'Furniture & Home Decor', 'Handicrafts', 'Hardware & Tools', 'Footwear & Leather', 'Organic Food Products', 'Kitchenware & Tableware'],
      allowCustom: true
    }
  ],
  freight_forwarder: [
    {
      key: 'services_offered',
      label: 'Services Offered',
      subtitle: 'Select logistics & shipping capabilities',
      options: ['Sea Freight', 'Air Freight', 'Road Transport', 'Customs Clearance', 'Warehousing', 'Other'],
      allowCustom: true
    }
  ],
  cha: [
    {
      key: 'ports_served',
      label: 'Ports You Serve',
      subtitle: 'Select major sea ports, ICDs, or airports you handle',
      options: ['Nhava Sheva (JNPT), Mumbai', 'Mundra Port, Gujarat', 'Chennai Port', 'Kolkata Port', 'Pipavav Port', 'Cochin Port', 'Delhi ICD Tughlakabad', 'Bangalore ICD/Airport', 'Hyderabad ICD/Airport'],
      allowCustom: true
    }
  ],
  export_consultant: [
    {
      key: 'area_of_expertise',
      label: 'Area of Expertise',
      subtitle: 'Select your specialized advisory domains',
      options: ['DGFT', 'Documentation', 'Market Research', 'Trade Finance', 'International Marketing', 'Other'],
      allowCustom: true
    }
  ],
  certification_agency: [
    {
      key: 'certification_services',
      label: 'Certification Services',
      subtitle: 'Select standard certifications provided',
      options: ['ISO 9001 / 14001 / 22000', 'CE Marking', 'Organic & USDA Certification', 'Halal Certification', 'FDA Registration', 'GMP & HACCP', 'BRCGS Standards', 'Phytosanitary Certification'],
      allowCustom: true
    }
  ],
  testing_laboratory: [
    {
      key: 'testing_services',
      label: 'Testing Services',
      subtitle: 'Select laboratory testing & inspection domains',
      options: ['Chemical Analysis', 'Food & Agriculture Testing', 'Textile & Fabric Inspection', 'Metals & Metallurgy', 'Microbiological Testing', 'Water Quality Testing', 'Environmental Testing', 'Pre-shipment Inspection'],
      allowCustom: true
    }
  ],
  service_provider: [
    {
      key: 'services_offered',
      label: 'Services Offered',
      subtitle: 'Select services provided to EXIM businesses',
      options: ['AI & Automation', 'Digital Marketing', 'Website Development', 'Branding', 'Photography', 'Product Design', 'Legal', 'Finance', 'Translation'],
      allowCustom: true
    }
  ],
  student: [
    {
      key: 'area_of_interest',
      label: 'Area of Interest',
      subtitle: 'Select your primary learning & career focus',
      options: ['Export', 'Import', 'Logistics', 'International Business', 'AI for EXIM'],
      allowCustom: true
    }
  ],
  aspiring_exporter: [
    {
      key: 'products_interested',
      label: "Products You're Interested In Exporting",
      subtitle: 'Select product segments you plan to start exporting',
      options: ['Spices & Agro Commodities', 'Handicrafts & Artisanal Goods', 'Garments & Apparel', 'Processed Foods', 'Cosmetics & Herbal', 'Leather Goods', 'Engineering Components', 'IT & Digital Services'],
      allowCustom: true
    }
  ],
  other: [
    {
      key: 'details',
      label: 'Your EXIM Specialization',
      subtitle: 'Specify your role or interest in international trade',
      options: ['Trade Association', 'Government Liaison', 'Academic Researcher', 'Investor / VC', 'Supply Chain Analyst'],
      allowCustom: true
    }
  ]
};
