"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
// Firebase Admin 초기화
admin.initializeApp();
// 환경 변수 설정
const SENDGRID_API_KEY = ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.api_key) || process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = ((_b = functions.config().email) === null || _b === void 0 ? void 0 : _b.admin) || process.env.ADMIN_EMAIL || 'admin@cloudsitefy.com';
// 이메일 전송 함수
const sendEmailToAdmin = async (data) => {
    const adminEmail = {
        to: ADMIN_EMAIL,
        from: 'noreply@cloudsitefy.com',
        subject: `[CloudSitefy] New Inquiry from ${data.name}`,
        html: `
      <h2>New Inquiry Received</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
      <p><strong>Service:</strong> ${data.service || 'Not selected'}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Received at: ${data.timestamp}</small></p>
      <p><small>IP Address: ${data.ip}</small></p>
      <p><small>User Agent: ${data.userAgent}</small></p>
    `
    };
    return sgMail.send(adminEmail);
};
const sendConfirmationEmail = async (data) => {
    const customerEmail = {
        to: data.email,
        from: 'noreply@cloudsitefy.com',
        subject: '[CloudSitefy] Your inquiry has been received',
        html: `
      <h2>Hello ${data.name}!</h2>
      <p>Thank you for contacting CloudSitefy.</p>
      <p>Your inquiry has been received with the following details:</p>
      <hr>
      <p><strong>Your message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Our team will review your inquiry and get back to you as soon as possible.</p>
      <p>If you have any additional questions, please don't hesitate to contact us.</p>
      <br>
      <p>Thank you!</p>
      <p><strong>CloudSitefy Team</strong></p>
    `
    };
    return sgMail.send(customerEmail);
};
// 메인 API 함수
exports.api = functions.https.onRequest(async (req, res) => {
    // CORS 헤더 설정
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    // OPTIONS 요청 처리 (preflight)
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    // GET 요청 처리
    if (req.method === 'GET') {
        res.status(200).json({
            message: 'CloudSitefy API is working!',
            timestamp: new Date().toISOString()
        });
        return;
    }
    // POST 요청 처리 (이메일 전송)
    if (req.method === 'POST') {
        try {
            // SendGrid API 키 확인
            if (!SENDGRID_API_KEY) {
                console.error('SendGrid API key not configured');
                res.status(500).json({ error: 'Email service not configured' });
                return;
            }
            sgMail.setApiKey(SENDGRID_API_KEY);
            // 요청 데이터 파싱
            const { name, email, phone, company, service, message, timestamp, userAgent, ip } = req.body;
            // 필수 필드 검증
            if (!name || !email || !phone || !message) {
                res.status(400).json({ error: 'Required fields are missing' });
                return;
            }
            // 이메일 형식 검증
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }
            // Honeypot 검증
            if (req.body.honeypot) {
                res.status(400).json({ error: 'Invalid request' });
                return;
            }
            // 이메일 전송
            await Promise.all([
                sendEmailToAdmin({ name, email, phone, company, service, message, timestamp, userAgent, ip }),
                sendConfirmationEmail({ name, email, phone, company, service, message, timestamp, userAgent, ip })
            ]);
            // 성공 응답
            res.status(200).json({
                success: true,
                message: 'Your inquiry has been sent successfully!'
            });
        }
        catch (error) {
            console.error('Email sending error:', error);
            res.status(500).json({
                error: 'Failed to send email. Please try again later.'
            });
        }
        return;
    }
    // 지원하지 않는 메서드
    res.status(405).json({ error: 'Method not allowed' });
});
// 기존 sendEmail 함수는 하위 호환성을 위해 유지
exports.sendEmail = functions.https.onRequest(async (req, res) => {
    // CORS 헤더 설정
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    // POST 요청만 허용
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        // SendGrid API 키 확인
        if (!SENDGRID_API_KEY) {
            console.error('SendGrid API key not configured');
            res.status(500).json({ error: 'Email service not configured' });
            return;
        }
        sgMail.setApiKey(SENDGRID_API_KEY);
        // 요청 데이터 파싱
        const { name, email, phone, company, service, message, timestamp, userAgent, ip } = req.body;
        // 필수 필드 검증
        if (!name || !email || !phone || !message) {
            res.status(400).json({ error: 'Required fields are missing' });
            return;
        }
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        // Honeypot 검증
        if (req.body.honeypot) {
            res.status(400).json({ error: 'Invalid request' });
            return;
        }
        // 이메일 전송
        await Promise.all([
            sendEmailToAdmin({ name, email, phone, company, service, message, timestamp, userAgent, ip }),
            sendConfirmationEmail({ name, email, phone, company, service, message, timestamp, userAgent, ip })
        ]);
        // 성공 응답
        res.status(200).json({
            success: true,
            message: 'Your inquiry has been sent successfully!'
        });
    }
    catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            error: 'Failed to send email. Please try again later.'
        });
    }
});
//# sourceMappingURL=index.js.map