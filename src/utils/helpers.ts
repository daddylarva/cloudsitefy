import { Inquiry, InquiryStatus } from '../types'

// 날짜 포맷팅
export const formatDate = (timestamp: any): string => {
  if (!timestamp) return 'N/A'
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Invalid Date'
  }
}

// 상태별 색상 클래스 반환
export const getStatusColorClasses = (status: InquiryStatus) => {
  const colorMap = {
    'new': 'bg-red-100 text-red-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'archived': 'bg-gray-100 text-gray-800',
  }
  return colorMap[status] || colorMap.new
}

// 상태 표시 텍스트 변환
export const getStatusDisplayText = (status: InquiryStatus): string => {
  return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// 문의 필터링
export const filterInquiries = (
  inquiries: Inquiry[],
  searchTerm: string,
  filter: InquiryStatus | 'all'
): Inquiry[] => {
  return inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' || inquiry.status === filter

    return matchesSearch && matchesFilter
  })
}

// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 전화번호 유효성 검사
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// 기본 답변 이메일 템플릿 생성
export const generateDefaultReplyTemplate = (inquiry: Inquiry) => {
  return {
    subject: `Re: Your inquiry about ${inquiry.service || 'our services'}`,
    message: `Dear ${inquiry.name},\n\nThank you for your inquiry. We have received your message and will get back to you shortly.\n\nBest regards,\nCloudSitefy Team`,
  }
}

// 로컬 스토리지 유틸리티
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 로컬 스토리지 사용 불가 시 무시
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // 로컬 스토리지 사용 불가 시 무시
    }
  },
}
