export type Language = 'en' | 'sw';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  quickExit: string;
  quickExitEsc: string;
  privateMode: string;
  noHistory: string;
  e2eEncrypted: string;
  dataActNotice: string;
  
  // Navigation
  navHotlines: string;
  navReport: string;
  navResources: string;
  navChat: string;
  navSafetyPlan: string;
  navAdmin: string;
  navSettings: string;
  
  // Emergency Contacts Screen
  hotlinesTitle: string;
  hotlinesSubtitle: string;
  tollFree: string;
  callNow: string;
  smsUssdFallbackBtn: string;
  smsUssdModalTitle: string;
  smsUssdModalDesc: string;
  triggerSmsAlert: string;
  
  // Incident Reporting
  reportTitle: string;
  reportSubtitle: string;
  reportAnonBanner: string;
  startReportBtn: string;
  consentTitle: string;
  consentText: string;
  incidentType: string;
  incidentTypePhysical: string;
  incidentTypeSexual: string;
  incidentTypeEmotional: string;
  incidentTypeFgm: string;
  incidentTypeChild: string;
  incidentTypeOther: string;
  whenOccurred: string;
  countyLocation: string;
  immediateDangerQ: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  optionalContactPhone: string;
  optionalContactHelp: string;
  supportNeededLabel: string;
  supportLegal: string;
  supportMedical: string;
  supportShelter: string;
  supportCounseling: string;
  submitReportBtn: string;
  reportSuccessTitle: string;
  reportSuccessDesc: string;
  trackingCodeLabel: string;
  
  // Resource Locator
  nearbyHelpTitle: string;
  nearbyHelpSubtitle: string;
  filterAll: string;
  filterHospital: string;
  filterPolice: string;
  filterShelter: string;
  filterLegal: string;
  viewFullMap: string;
  viewListView: string;
  lowDataModeBadge: string;
  verifiedSafeSpace: string;
  distanceAway: string;
  getDirections: string;
  
  // Safety Planning
  safetyPlanTitle: string;
  safetyPlanSubtitle: string;
  packBag: string;
  identifyRoute: string;
  keepPhoneCharged: string;
  saveNumberNeighbor: string;
  codeWordFamily: string;
  addNewStep: string;
  addStepPlaceholder: string;
  localOnlyNotice: string;
  
  // Counselor Chat
  chatTitle: string;
  chatSubtitle: string;
  expectedResponseTime: string;
  typeMessagePlaceholder: string;
  sendBtn: string;
  
  // Privacy & Disguise
  disguiseAppBtn: string;
  disguiseTitle: string;
  disguiseDesc: string;
  clearHistoryBtn: string;
  lowDataToggle: string;
  shakeToExitToggle: string;
  copyrightNotice: string;
  allRightsReserved: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Usalama Kenya',
    appSubtitle: 'Secure & Confidential',
    quickExit: 'Quick Exit',
    quickExitEsc: '(ESC)',
    privateMode: 'Private Mode Active',
    noHistory: 'No History Saved',
    e2eEncrypted: 'End-to-End Encrypted',
    dataActNotice: 'Usalama Kenya • Licensed under Kenya Data Protection Act 2019',
    
    navHotlines: 'Emergency Hotlines',
    navReport: 'Report Incident',
    navResources: 'Nearby Help Points',
    navChat: 'Counselor Chat',
    navSafetyPlan: 'Safety Planning',
    navAdmin: 'Admin & Counselor',
    navSettings: 'Discreet Settings',
    
    hotlinesTitle: 'Emergency Hotlines / Nambari za Dharura',
    hotlinesSubtitle: '24/7 Support • All calls are toll-free and confidential',
    tollFree: 'Toll-free',
    callNow: 'Call Now',
    smsUssdFallbackBtn: 'USSD / Feature Phone SMS Alert',
    smsUssdModalTitle: 'SMS & USSD Feature Phone Fallback',
    smsUssdModalDesc: 'Send an encrypted emergency alert via Africa\'s Talking SMS Gateway to HAK 1195 and closest responders even on basic feature phones or low connectivity.',
    triggerSmsAlert: 'Send SMS Emergency Alert Now',
    
    reportTitle: 'Report an Incident Anonymously',
    reportSubtitle: 'Securely share details with verified responders without revealing your identity. You control your data.',
    reportAnonBanner: 'Your report is anonymous by default. All text is encrypted before being stored under the Kenya Data Protection Act 2019.',
    startReportBtn: 'Start Report Now',
    consentTitle: 'Informed Consent Notice',
    consentText: 'I understand that this information will be shared only with verified GBV counselors to provide support or referrals. No identifying data is collected unless I voluntarily provide a contact number.',
    incidentType: 'Type of Incident',
    incidentTypePhysical: 'Physical Violence / Assault',
    incidentTypeSexual: 'Sexual Violence / Rape',
    incidentTypeEmotional: 'Emotional / Domestic Abuse',
    incidentTypeFgm: 'FGM / Harmful Traditional Practice',
    incidentTypeChild: 'Child Abuse / Neglect',
    incidentTypeOther: 'Other Emergency / Harassment',
    whenOccurred: 'Approximate Time of Incident',
    countyLocation: 'County / Area',
    immediateDangerQ: 'Is the survivor currently in immediate physical danger?',
    descriptionLabel: 'Description of what happened',
    descriptionPlaceholder: 'Describe the situation briefly... Do not include names if you wish to stay anonymous.',
    optionalContactPhone: 'Optional Contact Phone (only if you want counselor follow-up)',
    optionalContactHelp: 'Leave blank to remain 100% anonymous',
    supportNeededLabel: 'What support is needed most right now?',
    supportLegal: 'Legal Aid & Protection Order',
    supportMedical: 'Post-Rape Medical / PEP Kit',
    supportShelter: 'Emergency Shelter / Safe House',
    supportCounseling: 'Trauma Counseling',
    submitReportBtn: 'Submit Encrypted Report',
    reportSuccessTitle: 'Report Submitted Securely',
    reportSuccessDesc: 'Your report has been encrypted and assigned an anonymous tracking code. Save this code to check status later:',
    trackingCodeLabel: 'Your Anonymous Tracking Code:',
    
    nearbyHelpTitle: 'Nearby Help Points',
    nearbyHelpSubtitle: 'Verified hospitals with GVRC, police stations, shelters, and legal aid clinics across Kenya',
    filterAll: 'All Help Points',
    filterHospital: 'Hospitals (GVRC)',
    filterPolice: 'Police Stations',
    filterShelter: 'Emergency Shelters',
    filterLegal: 'Legal Aid Clinics',
    viewFullMap: 'View Full Map / List',
    viewListView: 'Switch to Fast List View (Low-Data)',
    lowDataModeBadge: 'Low-Data Mode On',
    verifiedSafeSpace: 'Verified Safe Space',
    distanceAway: 'away',
    getDirections: 'Call & Get Directions',
    
    safetyPlanTitle: 'Safety Planning',
    safetyPlanSubtitle: 'Essential steps to take when in danger. Stored on this device only.',
    packBag: 'Pack emergency bag (documents, cash, medicine)',
    identifyRoute: 'Identify safe exit routes from home',
    keepPhoneCharged: 'Keep phone charged and save 1195 hotline',
    saveNumberNeighbor: 'Agree on a secret signal with a trusted neighbor',
    codeWordFamily: 'Set an emergency code word with family or friends',
    addNewStep: 'Add Custom Safety Step',
    addStepPlaceholder: 'Enter safety reminder...',
    localOnlyNotice: 'Safety plan items are saved on-device only and never synced to servers.',
    
    chatTitle: 'Counselor Support Chat',
    chatSubtitle: 'Text-based confidential chat with trained GBV counselors',
    expectedResponseTime: 'Expected Response Time: ~5 minutes • 100% End-to-End Encrypted',
    typeMessagePlaceholder: 'Type a message safely... (or ask for emergency rescue)',
    sendBtn: 'Send Message',
    
    disguiseAppBtn: 'Disguise App',
    disguiseTitle: 'Disguised App Mode',
    disguiseDesc: 'Switch the app screen to look like a Weather Forecast, Notes app, or Calculator to protect against snooping.',
    clearHistoryBtn: 'Clear App Cache & Session',
    lowDataToggle: 'Low-Data Mode (No Map Tiles / Fast 3G)',
    shakeToExitToggle: 'Enable Triple-Tap / Shake Panic Exit',
    copyrightNotice: '© 2026 Usalama Kenya (Salama Kenya) • Built for civic safety & protection of GBV survivors across Kenya.',
    allRightsReserved: 'All Rights Reserved • Kenya Data Protection Act 2019 Compliant • Helpline 1195 Toll-Free'
  },
  sw: {
    appTitle: 'Usalama Kenya',
    appSubtitle: 'Siri na Salama',
    quickExit: 'Ondoka Haraka',
    quickExitEsc: '(ESC)',
    privateMode: 'Hali ya Siri Ipo Kazi',
    noHistory: 'Hakuna Historia Inayohifadhiwa',
    e2eEncrypted: 'Ulinzi wa Siri Mwanzo-Mwisho',
    dataActNotice: 'Usalama Kenya • Inafuata Sheria ya Ulinzi wa Data Kenya 2019',
    
    navHotlines: 'Nambari za Dharura',
    navReport: 'Ripoti Tukio',
    navResources: 'Vituo vya Msaada Karibu',
    navChat: 'Mazungumzo na Mshauri',
    navSafetyPlan: 'Mpango wa Usalama',
    navAdmin: 'Wataalamu na Msimamizi',
    navSettings: 'Mipangilio ya Siri',
    
    hotlinesTitle: 'Emergency Hotlines / Nambari za Dharura',
    hotlinesSubtitle: 'Msaada wa 24/7 • Simu zote ni za bure na za siri kabisa',
    tollFree: 'Bila malipo',
    callNow: 'Piga Sasa',
    smsUssdFallbackBtn: 'Msaada wa SMS / USSD kwa Simu za Kawaida',
    smsUssdModalTitle: 'Huduma ya SMS & USSD ya Dharura',
    smsUssdModalDesc: 'Tuma ujumbe wa dharura wa siri kupitia Africa\'s Talking kwenda HAK 1195 na wanausalama walio karibu hata bila mtandao wa kasi.',
    triggerSmsAlert: 'Tuma SMS ya Dharura Sasa',
    
    reportTitle: 'Ripoti Tukio Kwa Siri Kabisa',
    reportSubtitle: 'Shiriki taarifa kwa siri na wataalamu waliothibitishwa bila kutaja jina lako.',
    reportAnonBanner: 'Ripoti yako ni ya siri. Taarifa zote zimefichwa kwa misimbo kulingana na Sheria ya Ulinzi wa Data ya Kenya 2019.',
    startReportBtn: 'Anza Ripoti Sasa',
    consentTitle: 'Taarifa ya Ridhaa ya Siri',
    consentText: 'Naelewa kwamba taarifa hii itashirikiwa tu na washauri wa GBV waliothibitishwa ili kutoa msaada. Hakuna jina au namba inayochukuliwa isipokuwa ukijaza kwa hiari.',
    incidentType: 'Aina ya Tukio',
    incidentTypePhysical: 'Unyanyasaji wa Kiumbile / Kupigwa',
    incidentTypeSexual: 'Unyanyasaji wa Kijinsia / Ubaka',
    incidentTypeEmotional: 'Unyanyasaji wa Kihisia / Numbani',
    incidentTypeFgm: 'Ukeketaji (FGM) / Mila Potofu',
    incidentTypeChild: 'Unyanyasaji wa Mtoto',
    incidentTypeOther: 'Dharura Nyingine / Unyanyasaji',
    whenOccurred: 'Muda wa Tukio',
    countyLocation: 'Kaunti / Eneo',
    immediateDangerQ: 'Je, mwathirika yuko hatarini hivi sasa?',
    descriptionLabel: 'Maelezo ya kile kilichotokea',
    descriptionPlaceholder: 'Eleza kwa ufupi... Usikumbuke kutaja majina ukipenda kubaki bila kutambulika.',
    optionalContactPhone: 'Nambari ya Simu ya Hiari (kama unataka mshauri akupigie)',
    optionalContactHelp: 'Acha wazi ili kubaki wa siri 100%',
    supportNeededLabel: 'Ni msaada gani unaohitajika zaidi sasa hivi?',
    supportLegal: 'Msaada wa Kisheria na Amri ya Ulinzi',
    supportMedical: 'Matibabu / PEP Kit',
    supportShelter: 'Makazi ya Dharura / Nyumba Salama',
    supportCounseling: 'Ushauri Nasaha wa Kiemeo',
    submitReportBtn: 'Tuma Ripoti ya Siri',
    reportSuccessTitle: 'Ripoti Imetumwa kwa Mafanikio',
    reportSuccessDesc: 'Ripoti yako imepokelewa kwa misimbo ya siri. Hifadhi msimbo huu kuangalia maendeleo baadaye:',
    trackingCodeLabel: 'Msimbo Wako wa Siri:',
    
    nearbyHelpTitle: 'Vituo vya Msaada Karibu',
    nearbyHelpSubtitle: 'Hospitali zilizothibitishwa (GVRC), vituo vya polisi, makazi salama na vituo vya sheria Kenya',
    filterAll: 'Vituo Vyote',
    filterHospital: 'Hospitali (GVRC)',
    filterPolice: 'Vituo vya Polisi',
    filterShelter: 'Makazi ya Dharura',
    filterLegal: 'Vituo vya Sheria',
    viewFullMap: 'Onyesha Ramani na Orodha',
    viewListView: 'Onyesha Orodha ya Kasi (Data Ndogo)',
    lowDataModeBadge: 'Hali ya Data Ndogo',
    verifiedSafeSpace: 'Kituo Salama Kilichothibitishwa',
    distanceAway: 'kutoka hapa',
    getDirections: 'Piga Simu & Maelekezo',
    
    safetyPlanTitle: 'Mpango wa Usalama',
    safetyPlanSubtitle: 'Hatua muhimu za kuchukua ukiwa hatarini. Inahifadhiwa kwenye simu yako pekee.',
    packBag: 'Amua begi la dharura (vitambulisho, pesa, dawa)',
    identifyRoute: 'Tambua njia salama ya kutoroka nyumbani',
    keepPhoneCharged: 'Hakikisha simu ina chaji na hifadhi nambari 1195',
    saveNumberNeighbor: 'Kukubaliana ishara ya siri na jirani unayemwamini',
    codeWordFamily: 'Wezesha neno la siri la dharura na familia au marafiki',
    addNewStep: 'Ongeza Hatua Yako ya Usalama',
    addStepPlaceholder: 'Andika kikumbusho cha usalama...',
    localOnlyNotice: 'Mpango wa usalama unahifadhiwa kwenye simu yako tu wala hautumwi mtandaoni.',
    
    chatTitle: 'Mazungumzo na Mshauri',
    chatSubtitle: 'Mazungumzo ya siri kwa maandishi na washauri wa GBV Kenya',
    expectedResponseTime: 'Muda wa Majibu: ~dakika 5 • Ushauri wa Siri Mwanzo-Mwisho',
    typeMessagePlaceholder: 'Andika ujumbe kwa usalama... (au omba uokoaji wa dharura)',
    sendBtn: 'Tuma Ujumbe',
    
    disguiseAppBtn: 'Ficha Programu',
    disguiseTitle: 'Hali ya Kuficha Programu',
    disguiseDesc: 'Badilisha muonekano uonekane kama Utabiri wa Hali ya Hewa, Dokezo au Kikokotozi ili kujilinda.',
    clearHistoryBtn: 'Futa Kumbukumbu Zote za Programu',
    lowDataToggle: 'Hali ya Data Ndogo (Bila Ramani / Kasi kwa 3G)',
    shakeToExitToggle: 'Washa Njia ya Kutikisika / Kugusa Mara 3 Kuzima',
    copyrightNotice: '© 2026 Usalama Kenya (Salama Kenya) • Imetengenezwa kwa ajili ya usalama wa jamii na ulinzi wa manusura wa ukatili Kenya.',
    allRightsReserved: 'Haki Zote Zimehifadhiwa • Inazingatia Sheria ya Ulinzi wa Data Kenya 2019 • Nambari ya Msaada 1195 Bila Malipo'
  }
};
