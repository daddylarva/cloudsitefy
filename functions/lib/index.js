"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.sendEmail = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// import * as cors from 'cors'
const sgMail = require("@sendgrid/mail");
// Firebase Admin 초기화
admin.initializeApp();
// CORS 미들웨어 (현재 사용하지 않음)
// const corsHandler = cors({ origin: true })
// SendGrid API 키 설정 (환경 변수에서 가져옴)
const SENDGRID_API_KEY = ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.api_key) || process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = ((_b = functions.config().email) === null || _b === void 0 ? void 0 : _b.admin) || process.env.ADMIN_EMAIL || 'admin@cloudsitefy.com';
// 이메일 전송 API
exports.sendEmail = functions.https.onRequest(async (req, res) => {
    // CORS 헤더 설정
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    // OPTIONS 요청 처리 (preflight)
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
        // 요청 본문 파싱
        const { name, email, phone, company, service, message, timestamp, userAgent, ip } = req.body;
        // 필수 필드 검증
        if (!name || !email || !phone || !message) {
            res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
            return;
        }
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: '올바른 이메일 형식이 아닙니다.' });
            return;
        }
        // Honeypot 검증 (숨겨진 필드에 값이 있으면 봇으로 간주)
        if (req.body.honeypot) {
            res.status(400).json({ error: '잘못된 접근입니다.' });
            return;
        }
        // Rate Limiting (간단한 구현)
        const clientIP = ip || req.ip || req.connection.remoteAddress;
        // const rateLimitKey = `rate_limit:${clientIP}`
        // Firebase Firestore에서 rate limit 확인 (선택사항)
        // const rateLimitDoc = await admin.firestore().collection('rate_limits').doc(clientIP).get()
        // if (rateLimitDoc.exists && rateLimitDoc.data()?.count > 10) {
        //   res.status(429).json({ error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' })
        //   return
        // }
        // SendGrid 설정
        if (!SENDGRID_API_KEY) {
            console.error('SendGrid API 키가 설정되지 않았습니다.');
            res.status(500).json({ error: '서버 설정 오류가 발생했습니다.' });
            return;
        }
        sgMail.setApiKey(SENDGRID_API_KEY);
        // 관리자에게 전송할 이메일
        const adminEmail = {
            to: ADMIN_EMAIL,
            from: 'noreply@cloudsitefy.com',
            subject: `[CloudSitefy] 새로운 문의가 접수되었습니다 - ${name}`,
            html: `
        <h2>새로운 문의가 접수되었습니다</h2>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>전화번호:</strong> ${phone}</p>
        <p><strong>회사명:</strong> ${company || '미입력'}</p>
        <p><strong>관심 서비스:</strong> ${service || '미선택'}</p>
        <p><strong>문의 내용:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>접수 시간: ${timestamp}</small></p>
        <p><small>IP 주소: ${clientIP}</small></p>
        <p><small>User Agent: ${userAgent}</small></p>
      `
        };
        // 고객에게 자동 응답 이메일
        const customerEmail = {
            to: email,
            from: 'noreply@cloudsitefy.com',
            subject: '[CloudSitefy] 문의가 접수되었습니다',
            html: `
        <h2>안녕하세요, ${name}님!</h2>
        <p>CloudSitefy에 문의해주셔서 감사합니다.</p>
        <p>아래 내용으로 문의가 접수되었습니다:</p>
        <hr>
        <p><strong>문의 내용:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>전문 상담사가 검토 후 빠른 시일 내에 답변드리겠습니다.</p>
        <p>추가 문의사항이 있으시면 언제든지 연락주세요.</p>
        <br>
        <p>감사합니다.</p>
        <p><strong>CloudSitefy 팀</strong></p>
      `
        };
        // 이메일 전송
        await Promise.all([
            sgMail.send(adminEmail),
            sgMail.send(customerEmail)
        ]);
        // 성공 응답
        res.status(200).json({
            success: true,
            message: '문의가 성공적으로 전송되었습니다.'
        });
    }
    catch (error) {
        console.error('이메일 전송 오류:', error);
        res.status(500).json({
            error: '이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
});
// API 엔드포인트 (rewrite 규칙과 매칭)
exports.api = functions.https.onRequest(async (req, res) => {
    // /api/send 경로로 들어온 요청을 sendEmail 함수로 라우팅
    if (req.path === '/send') {
        return (0, exports.sendEmail)(req, res);
    }
    res.status(404).json({ error: 'API 엔드포인트를 찾을 수 없습니다.' });
});
//# sourceMappingURL=index.js.map