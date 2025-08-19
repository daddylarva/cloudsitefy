import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'

admin.initializeApp()
const db = admin.firestore()

// Zoho SMTP 설정
const ZOHO_USER = functions.config().zoho?.user || process.env.ZOHO_USER || 'admin@cloudsitefy.com'
const ZOHO_PASS = functions.config().zoho?.pass || process.env.ZOHO_PASS || 'your-zoho-password'

// Zoho SMTP 트랜스포터 생성
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: ZOHO_USER,
      pass: ZOHO_PASS
    }
  })
}

const sendEmailToAdmin = async (data: any) => {
  const transporter = createTransporter()
  
  const adminEmail = {
    from: `"CloudSitefy" <${ZOHO_USER}>`,
    to: functions.config().email?.admin || process.env.ADMIN_EMAIL || 'admin@cloudsitefy.com',
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
  }
  
  return transporter.sendMail(adminEmail)
}

const sendConfirmationEmail = async (data: any) => {
  const transporter = createTransporter()
  
  const customerEmail = {
    from: `"CloudSitefy" <${ZOHO_USER}>`,
    to: data.email,
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
  }
  
  return transporter.sendMail(customerEmail)
}

const saveInquiryToFirestore = async (data: any) => {
  const inquiryData = {
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'new',
    read: false,
    responded: false
  }
  return db.collection('inquiries').add(inquiryData)
}

// 메인 API 함수
export const api = functions.https.onRequest(async (req, res) => {
  // CORS 헤더 설정
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  // GET 요청 처리
  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'CloudSitefy API is working!',
      timestamp: new Date().toISOString()
    })
    return
  }

  // POST 요청 처리 (이메일 전송)
  if (req.method === 'POST') {
    try {
      // 요청 데이터 파싱
      const { name, email, phone, company, service, message, timestamp, userAgent, ip } = req.body

      // 필수 필드 검증
      if (!name || !email || !phone || !message) {
        res.status(400).json({ error: 'Required fields are missing' })
        return
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' })
        return
      }

      // Honeypot 검증
      if (req.body.honeypot) {
        res.status(400).json({ error: 'Invalid request' })
        return
      }

      // Firestore에 데이터 저장 (먼저 시도)
      let inquiryRef
      try {
        inquiryRef = await saveInquiryToFirestore({ 
          name, email, phone, company, service, message, timestamp, userAgent, ip 
        })
        console.log('Data saved to Firestore successfully:', inquiryRef.id)
      } catch (firestoreError) {
        console.error('Firestore save error:', firestoreError)
        res.status(500).json({ error: 'Failed to save inquiry to database' })
        return
      }

      // Gmail 설정 확인 및 이메일 전송 (선택사항)
      if (ZOHO_USER && ZOHO_USER !== 'admin@cloudsitefy.com' && ZOHO_PASS && ZOHO_PASS !== 'your-zoho-password') {
        try {
          // 이메일 전송
          await Promise.all([
            sendEmailToAdmin({ name, email, phone, company, service, message, timestamp, userAgent, ip }),
            sendConfirmationEmail({ name, email, phone, company, service, message, timestamp, userAgent, ip })
          ])
          
          console.log('Emails sent successfully via Zoho SMTP')
        } catch (emailError) {
          console.error('Email sending error:', emailError)
          // 이메일 전송 실패해도 Firestore 저장은 성공했으므로 계속 진행
        }
      } else {
        console.log('Zoho credentials not configured, skipping email sending')
      }

      // 성공 응답
      res.status(200).json({ 
        success: true, 
        message: 'Your inquiry has been sent successfully!',
        inquiryId: inquiryRef.id,
        emailSent: ZOHO_USER && ZOHO_USER !== 'admin@cloudsitefy.com' && ZOHO_PASS && ZOHO_PASS !== 'your-zoho-password'
      })

    } catch (error) {
      console.error('API error:', error)
      res.status(500).json({ 
        error: 'Failed to process inquiry. Please try again later.' 
      })
    }
    return
  }

  // 지원하지 않는 메서드
  res.status(405).json({ error: 'Method not allowed' })
})

export const adminInquiries = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const token = authHeader.split('Bearer ')[1]
    if (token !== 'Impulse9@') {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    if (req.method === 'GET') {
      const { status, limit = 50, offset = 0 } = req.query
      let query = db.collection('inquiries').orderBy('createdAt', 'desc')
      if (status && status !== 'all') {
        query = query.where('status', '==', status)
      }
      const snapshot = await query.limit(Number(limit)).offset(Number(offset)).get()
      const inquiries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      res.status(200).json({ inquiries })
      return
    }

    if (req.method === 'PUT') {
      const { id, status, read, responded, notes } = req.body
      if (!id) {
        res.status(400).json({ error: 'Inquiry ID is required' })
        return
      }
      const updateData: any = {}
      if (status !== undefined) updateData.status = status
      if (read !== undefined) updateData.read = read
      if (responded !== undefined) updateData.responded = responded
      if (notes !== undefined) updateData.notes = notes
      updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp()
      await db.collection('inquiries').doc(id).update(updateData)
      res.status(200).json({ success: true, message: 'Inquiry updated successfully' })
      return
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        res.status(400).json({ error: 'Inquiry ID is required' })
        return
      }
      await db.collection('inquiries').doc(id as string).delete()
      res.status(200).json({ success: true, message: 'Inquiry deleted successfully' })
      return
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Admin API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export const sendEmail = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    if (!ZOHO_USER || ZOHO_USER === 'admin@cloudsitefy.com' || !ZOHO_PASS || ZOHO_PASS === 'your-zoho-password') {
      console.error('Zoho credentials not configured')
      res.status(500).json({ error: 'Email service not configured' })
      return
    }
    
    const { name, email, phone, company, service, message, timestamp, userAgent, ip } = req.body
    if (!name || !email || !phone || !message) {
      res.status(400).json({ error: 'Required fields are missing' })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' })
      return
    }
    if (req.body.honeypot) {
      res.status(400).json({ error: 'Invalid request' })
      return
    }
    const inquiryRef = await saveInquiryToFirestore({
      name, email, phone, company, service, message, timestamp, userAgent, ip
    })
    await Promise.all([
      sendEmailToAdmin({ name, email, phone, company, service, message, timestamp, userAgent, ip }),
      sendConfirmationEmail({ name, email, phone, company, service, message, timestamp, userAgent, ip })
    ])
    res.status(200).json({
      success: true,
      message: 'Your inquiry has been sent successfully!',
      inquiryId: inquiryRef.id
    })
  } catch (error) {
    console.error('Email sending error:', error)
    res.status(500).json({
      error: 'Failed to send email. Please try again later.'
    })
  }
})

// 답변 이메일 전송 함수
export const sendReplyEmail = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // 인증 확인
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const token = authHeader.split('Bearer ')[1]
    if (token !== 'Impulse9@') {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    // Gmail 설정 확인
    if (!ZOHO_USER || ZOHO_USER === 'admin@cloudsitefy.com' || !ZOHO_PASS || ZOHO_PASS === 'your-zoho-password') {
      console.error('Zoho credentials not configured')
      res.status(500).json({ error: 'Email service not configured' })
      return
    }

    const transporter = createTransporter()

    const { inquiryId, to, subject, message } = req.body

    if (!to || !subject || !message) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    // 답변 이메일 전송
    const replyEmail = {
      from: `"CloudSitefy" <${ZOHO_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">CloudSitefy</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              ${message.replace(/\n/g, '<br>')}
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              
              <div style="text-align: center; color: #666; font-size: 14px;">
                <p>This email is in response to your inquiry about CloudSitefy services.</p>
                <p>If you have any further questions, please don't hesitate to contact us.</p>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>&copy; 2025 CloudSitefy. All rights reserved.</p>
            <p>This email was sent from CloudSitefy Team</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(replyEmail)

    // Firestore에서 문의 상태 업데이트
    try {
      await db.collection('inquiries').doc(inquiryId).update({
        responded: true,
        status: 'in-progress',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
    } catch (firestoreError) {
      console.error('Failed to update inquiry status:', firestoreError)
      // 이메일은 전송되었지만 상태 업데이트 실패
    }

    res.status(200).json({ 
      success: true, 
      message: 'Reply email sent successfully' 
    })

  } catch (error) {
    console.error('Reply email error:', error)
    res.status(500).json({ 
      error: 'Failed to send reply email. Please try again later.' 
    })
  }
})

