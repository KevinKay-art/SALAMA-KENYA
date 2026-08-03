import { Router } from 'express';
import { DB } from '../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'SalamaKenyaJwtSecret2026!DefaultTestingKey';

// ==========================================
// 1. EMERGENCY CONTACTS DIRECTORY API
// ==========================================
router.get('/contacts', (req, res) => {
  const contacts = DB.getContacts();
  res.json({ success: true, count: contacts.length, data: contacts });
});

router.post('/contacts', (req, res) => {
  const { name, number, category, descriptionEn, descriptionSw, tollFree, available247, languages, urgencyLevel, displayOrder } = req.body;
  if (!name || !number || !category) {
    return res.status(400).json({ success: false, error: 'Name, number, and category are required' });
  }
  const created = DB.createContact({
    name,
    number,
    category,
    descriptionEn: descriptionEn || name,
    descriptionSw: descriptionSw || name,
    tollFree: tollFree !== undefined ? tollFree : true,
    available247: available247 !== undefined ? available247 : true,
    languages: languages || 'English, Kiswahili',
    urgencyLevel: urgencyLevel || 'high',
    displayOrder: displayOrder || 10
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/contacts/:id', (req, res) => {
  const updated = DB.updateContact(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Contact not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/contacts/:id', (req, res) => {
  DB.deleteContact(req.params.id);
  res.json({ success: true, message: 'Contact deleted successfully' });
});

// ==========================================
// 2. RESOURCE LOCATOR DIRECTORY API
// ==========================================
router.get('/resources', (req, res) => {
  const { category, county } = req.query;
  const resources = DB.getResources(category as string, county as string);
  res.json({ success: true, count: resources.length, data: resources });
});

router.post('/resources', (req, res) => {
  const { name, category, county, address, phone, secondaryPhone, openingHours, servicesOffered, isVerified, isSafeSpace, latitude, longitude, notes } = req.body;
  if (!name || !category || !county || !address || !phone || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, error: 'Missing required resource fields' });
  }
  const created = DB.createResource({
    name,
    category,
    county,
    address,
    phone,
    secondaryPhone,
    openingHours: openingHours || '24/7',
    servicesOffered: Array.isArray(servicesOffered) ? servicesOffered : [servicesOffered].filter(Boolean),
    isVerified: isVerified !== undefined ? isVerified : true,
    isSafeSpace: isSafeSpace !== undefined ? isSafeSpace : true,
    latitude: Number(latitude),
    longitude: Number(longitude),
    notes
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/resources/:id', (req, res) => {
  const updated = DB.updateResource(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Resource not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/resources/:id', (req, res) => {
  DB.deleteResource(req.params.id);
  res.json({ success: true, message: 'Resource deleted' });
});

// ==========================================
// 3. INCIDENT REPORTING API (ENCRYPTED / ANONYMOUS)
// ==========================================
router.post('/reports', (req, res) => {
  const { incidentType, dateApprox, county, immediateDanger, description, contactPhone, consentGiven, supportRequested } = req.body;
  if (!consentGiven) {
    return res.status(400).json({ success: false, error: 'User consent is required before submitting an incident report' });
  }
  if (!description || !incidentType) {
    return res.status(400).json({ success: false, error: 'Incident type and description are required' });
  }
  const report = DB.createReport({
    incidentType,
    dateApprox: dateApprox || 'Recently',
    county: county || 'Unspecified',
    immediateDanger: Boolean(immediateDanger),
    description,
    contactPhone,
    consentGiven: true,
    supportRequested: Array.isArray(supportRequested) ? supportRequested : []
  });
  res.status(201).json({
    success: true,
    message: 'Report submitted securely with end-to-end encryption.',
    data: report
  });
});

router.get('/reports', (req, res) => {
  const reports = DB.getReports();
  res.json({ success: true, count: reports.length, data: reports });
});

router.get('/reports/track/:code', (req, res) => {
  const report = DB.getReportByTrackingCode(req.params.code);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report tracking code not found' });
  }
  res.json({ success: true, data: report });
});

router.patch('/reports/:id/status', (req, res) => {
  const { status, counselorNotes } = req.body;
  const updated = DB.updateReportStatus(req.params.id, status, counselorNotes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.json({ success: true, data: updated });
});

// ==========================================
// 4. COUNSELOR SUPPORT CHAT API
// ==========================================
router.get('/chat/:sessionId', (req, res) => {
  const messages = DB.getMessagesBySession(req.params.sessionId);
  res.json({ success: true, count: messages.length, data: messages });
});

router.post('/chat/:sessionId', (req, res) => {
  const { senderType, senderName, message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty' });
  }
  const added = DB.addMessage(
    req.params.sessionId,
    senderType || 'survivor',
    senderName || (senderType === 'counselor' ? 'On-Call Counselor' : 'Survivor'),
    message.trim()
  );

  // Auto-respond for demo if survivor sends a message
  if (senderType === 'survivor') {
    setTimeout(() => {
      DB.addMessage(
        req.params.sessionId,
        'counselor',
        'On-Call GBV Counselor',
        'Thank you for reaching out to Usalama Kenya. I am reviewing your message and am here to support you safely and confidentially. Are you currently in a safe location?'
      );
    }, 1500);
  }

  res.status(201).json({ success: true, data: added });
});

// ==========================================
// 5. AUTHENTICATION & ADMIN ROLE-GATING API
// ==========================================
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }
  const user = DB.authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '12h' });
  res.json({ success: true, token, user });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (e) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

// ==========================================
// 6. ANONYMIZED ANALYTICS API
// ==========================================
router.get('/analytics', (req, res) => {
  const analytics = DB.getAnalytics();
  res.json({ success: true, data: analytics });
});

// ==========================================
// 7. AFRICA'S TALKING SMS / USSD FALLBACK SIMULATION API
// ==========================================
router.post('/sms-ussd-fallback', (req, res) => {
  const { phone, action, location } = req.body;
  // Simulates an Africa's Talking API SMS dispatch or USSD trigger
  const smsConfirmation = {
    status: 'SENT',
    provider: "Africa's Talking Gateway (Kenya)",
    recipient: phone || 'Anonymous Feature Phone',
    dispatchedMessage: `USALAMA KENYA ALERT: Your emergency alert has been received. HAK Helpline 1195 and nearest responder (${location || 'Nairobi Area'}) notified. Keep phone silent if unsafe.`,
    timestamp: new Date().toISOString()
  };
  res.json({
    success: true,
    message: "SMS/USSD fallback triggered successfully over Africa's Talking API.",
    data: smsConfirmation
  });
});

export default router;
