// 공통 타입 정의
export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  timestamp: string
  status: InquiryStatus
  read: boolean
  responded: boolean
  notes?: string
  createdAt: any
  updatedAt?: any
}

export type InquiryStatus = 'new' | 'in-progress' | 'completed' | 'archived'

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  honeypot?: string
}

export interface EmailData {
  inquiryId?: string
  to: string
  subject: string
  message: string
  inquiryName?: string
}

export interface ApiResponse<T = any> {
  success?: boolean
  message?: string
  error?: string
  data?: T
  inquiryId?: string
  emailSent?: boolean
}

// 상수 정의
export const ADMIN_TOKEN = 'Impulse9@'
export const API_BASE_URL = 'https://us-central1-cloudsitefy.cloudfunctions.net'
export const INQUIRY_STATUSES: InquiryStatus[] = ['new', 'in-progress', 'completed', 'archived']
