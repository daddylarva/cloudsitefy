import { Inquiry, InquiryFormData, EmailData, ApiResponse, ADMIN_TOKEN, API_BASE_URL } from '../types'

// API 헤더 설정
const getHeaders = () => ({
  'Content-Type': 'application/json',
})

const getAuthHeaders = () => ({
  ...getHeaders(),
  'Authorization': `Bearer ${ADMIN_TOKEN}`,
})

// 문의 관련 API
export const inquiryApi = {
  // 문의 제출
  submit: async (data: InquiryFormData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: await getClientIP(),
      }),
    })
    return response.json()
  },

  // 문의 목록 조회
  fetchAll: async (status: string = 'all'): Promise<{ inquiries: Inquiry[] }> => {
    const response = await fetch(`${API_BASE_URL}/adminInquiries?status=${status}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch inquiries')
    return response.json()
  },

  // 문의 상태 업데이트
  update: async (id: string, updates: Partial<Inquiry>): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/adminInquiries`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...updates }),
    })
    if (!response.ok) throw new Error('Failed to update inquiry')
    return response.json()
  },

  // 문의 삭제
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/adminInquiries?id=${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete inquiry')
    return response.json()
  },
}

// 이메일 관련 API
export const emailApi = {
  // 답변 이메일 전송
  sendReply: async (data: EmailData): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/sendReplyEmail`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to send reply email')
    return response.json()
  },
}

// 클라이언트 IP 주소 가져오기
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    return 'unknown'
  }
}
