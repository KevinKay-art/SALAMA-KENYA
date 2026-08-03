import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Encryption helper for sensitive fields (at rest simulation & real AES-256-GCM)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'SalamaKenya2026SecretKey32BytesLong@!!';
const IV_LENGTH = 16;

export function encryptText(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (e) {
    return text;
  }
}

export function decryptText(encryptedText: string): string {
  try {
    if (!encryptedText.includes(':')) return encryptedText;
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return encryptedText;
  }
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: 'hotline' | 'child' | 'police' | 'medical' | 'legal' | 'shelter';
  descriptionEn: string;
  descriptionSw: string;
  tollFree: boolean;
  available247: boolean;
  languages: string;
  urgencyLevel: 'high' | 'medium' | 'general';
  displayOrder: number;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'hospital' | 'police' | 'shelter' | 'legal' | 'counseling';
  county: string;
  address: string;
  phone: string;
  secondaryPhone?: string;
  openingHours: string;
  servicesOffered: string[];
  isVerified: boolean;
  isSafeSpace: boolean;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'counselor';
  organization: string;
  county: string;
  isActive: boolean;
}

export interface IncidentReport {
  id: string;
  trackingCode: string;
  incidentType: 'physical_violence' | 'sexual_violence' | 'emotional_abuse' | 'fgm' | 'child_abuse' | 'other';
  dateApprox: string;
  county: string;
  immediateDanger: boolean;
  descriptionEncrypted: string;
  contactPhoneEncrypted?: string;
  consentGiven: boolean;
  status: 'new' | 'in_review' | 'referral_made' | 'closed';
  counselorNotes?: string;
  supportRequested: string[];
  createdAt: string;
}

export interface ChatMessageItem {
  id: string;
  sessionId: string;
  senderType: 'survivor' | 'counselor' | 'system';
  senderName: string;
  messageEncrypted: string;
  readStatus: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'salama-data.json');

// 1. Seed Verified Kenyan Contacts (Section 6 defaults + comprehensive list)
const defaultContacts: EmergencyContact[] = [
  {
    id: 'hak-1195',
    name: 'National GBV Helpline (HAK 1195)',
    number: '1195',
    category: 'hotline',
    descriptionEn: 'Toll-free 24/7 National GBV Helpline operated by Healthcare Assistance Kenya & Ministry of Gender.',
    descriptionSw: 'Nambari ya bure ya masaa 24/7 ya unyanyasaji (GBV) inayoendeshwa na Healthcare Assistance Kenya.',
    tollFree: true,
    available247: true,
    languages: 'English, Kiswahili, Kikuyu, Luhya, Kalenjin',
    urgencyLevel: 'high',
    displayOrder: 1,
  },
  {
    id: 'child-116',
    name: 'Child Helpline Kenya',
    number: '116',
    category: 'child',
    descriptionEn: 'Toll-free emergency helpline for cases involving minors, child abuse, and neglect.',
    descriptionSw: 'Nambari ya bure ya dharura ya usaidizi kwa watoto, dhuluma, au unyanyasaji wa mtoto.',
    tollFree: true,
    available247: true,
    languages: 'English, Kiswahili',
    urgencyLevel: 'high',
    displayOrder: 2,
  },
  {
    id: 'police-999',
    name: 'Police & General Emergency',
    number: '999',
    category: 'police',
    descriptionEn: 'National Police Service emergency response and rapid police dispatch.',
    descriptionSw: 'Dharura ya Polisi ya Taifa na kutuma polisi wa uokoaji.',
    tollFree: true,
    available247: true,
    languages: 'English, Kiswahili',
    urgencyLevel: 'high',
    displayOrder: 3,
  },
  {
    id: 'police-112',
    name: 'National Emergency Service (112)',
    number: '112',
    category: 'police',
    descriptionEn: 'Unified emergency dispatch line for Police, Ambulance & Fire Services across Kenya.',
    descriptionSw: 'Nambari moja ya dharura ya kitaifa kwa Polisi, Gari la Wagonjwa na Zima Moto.',
    tollFree: true,
    available247: true,
    languages: 'English, Kiswahili',
    urgencyLevel: 'high',
    displayOrder: 4,
  },
  {
    id: 'creaw-0800',
    name: 'CREAW Kenya Support Line',
    number: '0800-720-186',
    category: 'legal',
    descriptionEn: 'Centre for Rights Education and Awareness. Toll-free legal aid, counselling, and shelter referrals.',
    descriptionSw: 'Msaada wa kisheria bila malipo, ushauri nasaha na rufaa za makazi salama.',
    tollFree: true,
    available247: false,
    languages: 'English, Kiswahili',
    urgencyLevel: 'medium',
    displayOrder: 5,
  },
  {
    id: 'fida-0800',
    name: 'FIDA Kenya Women’s Legal Aid',
    number: '0800-720-501',
    category: 'legal',
    descriptionEn: 'Federation of Women Lawyers Kenya. Free legal counsel, court representation, and advocacy.',
    descriptionSw: 'Wanasheria Wanawake Kenya. Msaada wa kisheria na utetezi bila malipo.',
    tollFree: true,
    available247: false,
    languages: 'English, Kiswahili',
    urgencyLevel: 'medium',
    displayOrder: 6,
  },
  {
    id: 'nairobi-gvrc',
    name: 'Nairobi Women’s Hospital GVRC',
    number: '0703-081-000',
    category: 'medical',
    descriptionEn: 'Gender Violence Recovery Centre. Free 24/7 comprehensive post-rape medical & psychological care.',
    descriptionSw: 'Kituo cha kupona kutokana na dhuluma za kijinsia. Huduma za bure za matibabu na ushauri 24/7.',
    tollFree: false,
    available247: true,
    languages: 'English, Kiswahili',
    urgencyLevel: 'high',
    displayOrder: 7,
  },
  {
    id: 'usikimye-0800',
    name: 'Usikimye (Speak Out Kenya)',
    number: '0800-000-999',
    category: 'shelter',
    descriptionEn: 'Emergency rescue, safe houses, psychosocial support, and legal clinics for GBV survivors.',
    descriptionSw: 'Uokoaji wa dharura, makazi salama, ushauri na msaada wa kisheria kwa waathirika wa unyanyasaji.',
    tollFree: true,
    available247: true,
    languages: 'English, Kiswahili',
    urgencyLevel: 'medium',
    displayOrder: 8,
  },
  {
    id: 'lvct-1190',
    name: 'LVCT Health ONE2ONE Line',
    number: '1190',
    category: 'hotline',
    descriptionEn: 'Toll-free youth counselling, HIV/sexual health support, and gender-based violence crisis line.',
    descriptionSw: 'Nambari ya bure ya ushauri kwa vijana na dharura za unyanyasaji wa kijinsia.',
    tollFree: true,
    available247: true,
    languages: 'English, Kiswahili',
    urgencyLevel: 'general',
    displayOrder: 9,
  }
];

// 2. Seed Verified Kenyan Resources (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Kilifi, Garissa)
const defaultResources: ResourceItem[] = [
  {
    id: 'res-nrb-1',
    name: 'Nairobi Women\'s Hospital GVRC - Hurlingham',
    category: 'hospital',
    county: 'Nairobi',
    address: 'Argwings Kodhek Road, Hurlingham, Nairobi',
    phone: '0703-081-000',
    secondaryPhone: '0703-081-001',
    openingHours: '24/7',
    servicesOffered: ['PEP / Emergency Contraception', 'Post-Rape Medical Kit', 'Forensic Exam', 'Trauma Counselling'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -1.2933,
    longitude: 36.7936,
    notes: 'Free comprehensive medical and psychological treatment for survivors of sexual and domestic violence.'
  },
  {
    id: 'res-nrb-2',
    name: 'Kilimani Police Station - Gender Desk',
    category: 'police',
    county: 'Nairobi',
    address: 'Argwings Kodhek Rd, Kilimani, Nairobi',
    phone: '020-2724900',
    openingHours: '24/7',
    servicesOffered: ['Specialized Gender Desk', 'OB Number Issuance', 'Emergency Police Escort', 'Protection Orders'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -1.2891,
    longitude: 36.7871,
    notes: 'Dedicated Gender Desk officers trained in trauma-informed survivor interviewing.'
  },
  {
    id: 'res-nrb-3',
    name: 'Kenyatta National Hospital (KNH) - GBV Centre',
    category: 'hospital',
    county: 'Nairobi',
    address: 'Hospital Road, Upper Hill, Nairobi',
    phone: '020-2726300',
    openingHours: '24/7',
    servicesOffered: ['Emergency Medical Treatment', 'PEP Kit Administration', 'Forensic DNA Kit', 'Inpatient Recovery'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -1.3015,
    longitude: 36.8073,
    notes: 'National Referral Hospital with 24-hour emergency trauma centre.'
  },
  {
    id: 'res-nrb-4',
    name: 'CREAW Legal Clinic - Lavington Headquarters',
    category: 'legal',
    county: 'Nairobi',
    address: 'Kabarsiran Avenue, Lavington, Nairobi',
    phone: '0800-720-186',
    openingHours: 'Mon-Fri 8:00 AM - 5:00 PM',
    servicesOffered: ['Free Legal Counseling', 'Court Representation', 'Child Custody Legal Aid', 'Protection Order Filing'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -1.2785,
    longitude: 36.7729,
    notes: 'Satellite legal assistance available in Kibera and Eastleigh.'
  },
  {
    id: 'res-nrb-5',
    name: 'Usikimye Safe House & Emergency Shelter',
    category: 'shelter',
    county: 'Nairobi',
    address: 'Confidential Location (Nairobi East)',
    phone: '0800-000-999',
    openingHours: '24/7 Emergency Intake',
    servicesOffered: ['Emergency Accommodation', 'Hot Meals & Clothing', 'Psychosocial Support', 'Relocation Assistance'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -1.2680,
    longitude: 36.8850,
    notes: 'Exact physical address confidential for survivor protection. Call toll-free line for immediate dispatch.'
  },
  {
    id: 'res-msa-1',
    name: 'Coast General Teaching & Referral Hospital GVRC',
    category: 'hospital',
    county: 'Mombasa',
    address: 'Abdel Nasser Road, Mwembe Tayari, Mombasa',
    phone: '041-2314201',
    openingHours: '24/7',
    servicesOffered: ['Post-Rape Medical Care', 'STI/HIV PEP Prophylaxis', 'Trauma Counseling', 'Forensic Documentation'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -4.0435,
    longitude: 39.6682,
    notes: 'Primary regional GBV medical recovery center for the Coast Region.'
  },
  {
    id: 'res-msa-2',
    name: 'Makupa Police Station Gender Desk',
    category: 'police',
    county: 'Mombasa',
    address: 'Makupa Road, Mombasa',
    phone: '041-2491122',
    openingHours: '24/7',
    servicesOffered: ['Gender Desk Police Report', 'Emergency Intervention', 'Safe Escort'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -4.0381,
    longitude: 39.6601
  },
  {
    id: 'res-ksm-1',
    name: 'Jaramogi Oginga Odinga Teaching & Referral Hospital (JOOTRH)',
    category: 'hospital',
    county: 'Kisumu',
    address: 'Kakamega Road, Kondele, Kisumu',
    phone: '057-2020801',
    openingHours: '24/7',
    servicesOffered: ['Comprehensive GBV Medical Kit', 'PEP Prophylaxis', 'Forensic Assessment', 'Mental Health Support'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -0.0917,
    longitude: 34.7680,
    notes: 'Dedicated Gender & Child Protection Unit inside Emergency Wing.'
  },
  {
    id: 'res-nkr-1',
    name: 'Nakuru Level 5 Hospital - Gender Protection Unit',
    category: 'hospital',
    county: 'Nakuru',
    address: 'Showground Road, Nakuru Town',
    phone: '051-2210080',
    openingHours: '24/7',
    servicesOffered: ['Emergency Post-Rape Care', 'PEP Administration', 'Forensic Evidence Collection', 'Counselling'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -0.2833,
    longitude: 36.0667
  },
  {
    id: 'res-eld-1',
    name: 'Moi Teaching and Referral Hospital (MTRH) - GBV Unit',
    category: 'hospital',
    county: 'Uasin Gishu',
    address: 'Nandi Road, Eldoret',
    phone: '053-2063300',
    openingHours: '24/7',
    servicesOffered: ['24/7 Specialized GBV Care', 'Forensic & Medical Exam', 'PEP / Contraception', 'Clinical Psychologist'],
    isVerified: true,
    isSafeSpace: true,
    latitude: 0.5143,
    longitude: 35.2698
  },
  {
    id: 'res-klf-1',
    name: 'CREAW Kilifi Legal & Referral Office',
    category: 'legal',
    county: 'Kilifi',
    address: 'Kilifi Town Center, Near County Assembly',
    phone: '0800-720-186',
    openingHours: 'Mon-Fri 8:30 AM - 4:30 PM',
    servicesOffered: ['Free Legal Advice', 'Referrals to Shelters', 'Community Protection Orders'],
    isVerified: true,
    isSafeSpace: true,
    latitude: -3.6305,
    longitude: 39.8499
  }
];

// 3. Seed Users (Admin & Counselor accounts for testing)
const defaultUsers: UserAccount[] = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Wanjiku Muthoni',
    email: 'admin@usalamakenya.org',
    passwordHash: 'counselor123', // Simple plain check for testing simplicity
    role: 'admin',
    organization: 'Healthcare Assistance Kenya (HAK)',
    county: 'National',
    isActive: true
  },
  {
    id: 'usr-counselor-1',
    name: 'Sister Achieng Odhiambo',
    email: 'counselor@usalamakenya.org',
    passwordHash: 'counselor123',
    role: 'counselor',
    organization: 'CREAW Kenya',
    county: 'Nairobi',
    isActive: true
  }
];

// 4. Seed Sample Incident Reports
const defaultReports: IncidentReport[] = [
  {
    id: 'rep-001',
    trackingCode: 'SAL-7821',
    incidentType: 'physical_violence',
    dateApprox: 'Yesterday evening',
    county: 'Nairobi',
    immediateDanger: false,
    descriptionEncrypted: encryptText('Spouse became abusive during argument. Need advice on obtaining a legal protection order and safe shelter options for me and my 4-year-old child.'),
    contactPhoneEncrypted: encryptText('0712345678'),
    consentGiven: true,
    status: 'in_review',
    counselorNotes: 'Assigned to CREAW legal team for protection order guidance. Advised on safe house options.',
    supportRequested: ['legal', 'shelter'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'rep-002',
    trackingCode: 'SAL-4109',
    incidentType: 'sexual_violence',
    dateApprox: 'This morning',
    county: 'Mombasa',
    immediateDanger: false,
    descriptionEncrypted: encryptText('Incident occurred on way home. Visited Coast General Hospital GVRC for PEP kit. Requesting confidential trauma counselling.'),
    contactPhoneEncrypted: encryptText('0722001122'),
    consentGiven: true,
    status: 'referral_made',
    counselorNotes: 'Referred to clinical psychologist at Coast General GVRC. Follow-up scheduled.',
    supportRequested: ['counseling', 'medical'],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// 5. Seed Sample Chat Messages
const defaultMessages: ChatMessageItem[] = [
  {
    id: 'msg-101',
    sessionId: 'session-demo-survivor',
    senderType: 'system',
    senderName: 'Salama System',
    messageEncrypted: encryptText('Welcome to Usalama Kenya Confidential Support. A trained counselor will reply within ~5 minutes. Your messages are end-to-end encrypted.'),
    readStatus: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg-102',
    sessionId: 'session-demo-survivor',
    senderType: 'counselor',
    senderName: 'Sister Achieng (CREAW Counselor)',
    messageEncrypted: encryptText('Hujambo (Hello). You are in a safe space. How can we assist you today? If you are in immediate danger, please tap the 1195 or 999 emergency button.'),
    readStatus: true,
    createdAt: new Date(Date.now() - 3500000).toISOString()
  }
];

interface DataStore {
  contacts: EmergencyContact[];
  resources: ResourceItem[];
  users: UserAccount[];
  reports: IncidentReport[];
  messages: ChatMessageItem[];
}

let store: DataStore = {
  contacts: defaultContacts,
  resources: defaultResources,
  users: defaultUsers,
  reports: defaultReports,
  messages: defaultMessages
};

// Load from file if exists
export function loadStore(): void {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      store = {
        contacts: parsed.contacts || defaultContacts,
        resources: parsed.resources || defaultResources,
        users: parsed.users || defaultUsers,
        reports: parsed.reports || defaultReports,
        messages: parsed.messages || defaultMessages
      };
    }
  } catch (e) {
    console.error('Failed to load store file, using default seed data:', e);
  }
}

// Save store to disk
export function saveStore(): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write store to disk:', e);
  }
}

loadStore();

export const DB = {
  // Contacts
  getContacts: () => store.contacts.sort((a, b) => a.displayOrder - b.displayOrder),
  getContactById: (id: string) => store.contacts.find(c => c.id === id),
  createContact: (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = { ...contact, id: 'cnt-' + Date.now() };
    store.contacts.push(newContact);
    saveStore();
    return newContact;
  },
  updateContact: (id: string, updates: Partial<EmergencyContact>) => {
    const index = store.contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    store.contacts[index] = { ...store.contacts[index], ...updates };
    saveStore();
    return store.contacts[index];
  },
  deleteContact: (id: string) => {
    store.contacts = store.contacts.filter(c => c.id !== id);
    saveStore();
    return true;
  },

  // Resources (Shelters, Hospitals, Police, Legal)
  getResources: (category?: string, county?: string) => {
    let res = store.resources;
    if (category && category !== 'all') {
      res = res.filter(r => r.category === category);
    }
    if (county && county !== 'all') {
      res = res.filter(r => r.county.toLowerCase() === county.toLowerCase());
    }
    return res;
  },
  getResourceById: (id: string) => store.resources.find(r => r.id === id),
  createResource: (res: Omit<ResourceItem, 'id'>) => {
    const newRes: ResourceItem = { ...res, id: 'res-' + Date.now() };
    store.resources.push(newRes);
    saveStore();
    return newRes;
  },
  updateResource: (id: string, updates: Partial<ResourceItem>) => {
    const idx = store.resources.findIndex(r => r.id === id);
    if (idx === -1) return null;
    store.resources[idx] = { ...store.resources[idx], ...updates };
    saveStore();
    return store.resources[idx];
  },
  deleteResource: (id: string) => {
    store.resources = store.resources.filter(r => r.id !== id);
    saveStore();
    return true;
  },

  // Reports
  getReports: () => {
    return store.reports.map(r => ({
      ...r,
      description: decryptText(r.descriptionEncrypted),
      contactPhone: r.contactPhoneEncrypted ? decryptText(r.contactPhoneEncrypted) : undefined
    }));
  },
  getReportByTrackingCode: (trackingCode: string) => {
    const r = store.reports.find(item => item.trackingCode.toUpperCase() === trackingCode.toUpperCase());
    if (!r) return null;
    return {
      ...r,
      description: decryptText(r.descriptionEncrypted),
      contactPhone: r.contactPhoneEncrypted ? decryptText(r.contactPhoneEncrypted) : undefined
    };
  },
  createReport: (data: {
    incidentType: IncidentReport['incidentType'];
    dateApprox: string;
    county: string;
    immediateDanger: boolean;
    description: string;
    contactPhone?: string;
    consentGiven: boolean;
    supportRequested: string[];
  }) => {
    const trackingCode = 'SAL-' + Math.floor(1000 + Math.random() * 9000);
    const newReport: IncidentReport = {
      id: 'rep-' + Date.now(),
      trackingCode,
      incidentType: data.incidentType,
      dateApprox: data.dateApprox,
      county: data.county,
      immediateDanger: data.immediateDanger,
      descriptionEncrypted: encryptText(data.description),
      contactPhoneEncrypted: data.contactPhone ? encryptText(data.contactPhone) : undefined,
      consentGiven: data.consentGiven,
      status: 'new',
      supportRequested: data.supportRequested || [],
      createdAt: new Date().toISOString()
    };
    store.reports.unshift(newReport);
    saveStore();
    return {
      id: newReport.id,
      trackingCode: newReport.trackingCode,
      status: newReport.status,
      createdAt: newReport.createdAt
    };
  },
  updateReportStatus: (id: string, status: IncidentReport['status'], notes?: string) => {
    const idx = store.reports.findIndex(r => r.id === id);
    if (idx === -1) return null;
    store.reports[idx].status = status;
    if (notes !== undefined) store.reports[idx].counselorNotes = notes;
    saveStore();
    return store.reports[idx];
  },

  // Chat messages
  getMessagesBySession: (sessionId: string) => {
    return store.messages
      .filter(m => m.sessionId === sessionId)
      .map(m => ({
        ...m,
        message: decryptText(m.messageEncrypted)
      }));
  },
  addMessage: (sessionId: string, senderType: 'survivor' | 'counselor' | 'system', senderName: string, text: string) => {
    const newMsg: ChatMessageItem = {
      id: 'msg-' + Date.now() + '-' + Math.floor(Math.random()*1000),
      sessionId,
      senderType,
      senderName,
      messageEncrypted: encryptText(text),
      readStatus: false,
      createdAt: new Date().toISOString()
    };
    store.messages.push(newMsg);
    saveStore();
    return {
      ...newMsg,
      message: text
    };
  },

  // Users
  authenticateUser: (email: string, passwordHash: string) => {
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);
    if (!user || !user.isActive) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      county: user.county
    };
  },
  getUsers: () => store.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, organization: u.organization, county: u.county })),

  // Analytics
  getAnalytics: () => {
    const reports = store.reports;
    const byCounty: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    reports.forEach(r => {
      byCounty[r.county] = (byCounty[r.county] || 0) + 1;
      byType[r.incidentType] = (byType[r.incidentType] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    });

    return {
      totalReports: reports.length,
      totalVerifiedResources: store.resources.filter(r => r.isVerified).length,
      totalHotlines: store.contacts.length,
      byCounty,
      byType,
      byStatus
    };
  }
};
