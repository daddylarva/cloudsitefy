import { useState, useEffect, useCallback } from 'react'
import type { Inquiry, InquiryStatus, EmailData } from '../types'
import { inquiryApi, emailApi } from '../services/api'
import { INQUIRY_STATUSES } from '../types'
import { 
  formatDate, 
  getStatusColorClasses, 
  getStatusDisplayText, 
  filterInquiries,
  generateDefaultReplyTemplate 
} from '../utils/helpers'

const AdminPanel = () => {
  // 상태 관리
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  
  // 폼 상태
  const [notes, setNotes] = useState('')
  const [replyEmail, setReplyEmail] = useState('')
  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  // 문의 목록 조회
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await inquiryApi.fetchAll(filter)
      setInquiries(data.inquiries || [])
    } catch (err) {
      setError('Failed to load inquiries')
      console.error('Error fetching inquiries:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  // 문의 상태 업데이트
  const updateInquiryStatus = useCallback(async (id: string, updates: Partial<Inquiry>) => {
    try {
      await inquiryApi.update(id, updates)
      
      setInquiries(prev => prev.map(inquiry =>
        inquiry.id === id ? { ...inquiry, ...updates } : inquiry
      ))

      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, ...updates } : null)
      }

      return true
    } catch (err) {
      console.error('Error updating inquiry:', err)
      return false
    }
  }, [selectedInquiry])

  // 문의 삭제
  const deleteInquiry = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    try {
      await inquiryApi.delete(id)
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== id))
      
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null)
        setIsModalOpen(false)
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err)
    }
  }, [selectedInquiry])

  // 문의 열기
  const openInquiry = useCallback((inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setNotes(inquiry.notes || '')
    setIsModalOpen(true)

    if (!inquiry.read) {
      updateInquiryStatus(inquiry.id, { read: true })
    }
  }, [updateInquiryStatus])

  // 노트 저장
  const saveNotes = useCallback(async () => {
    if (selectedInquiry) {
      const success = await updateInquiryStatus(selectedInquiry.id, { notes })
      if (success) {
        setIsModalOpen(false)
      }
    }
  }, [selectedInquiry, updateInquiryStatus])

  // 답변 모달 열기
  const openReplyModal = useCallback((inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setReplyEmail(inquiry.email)
    
    const template = generateDefaultReplyTemplate(inquiry)
    setReplySubject(template.subject)
    setReplyMessage(template.message)
    
    setIsReplyModalOpen(true)
  }, [])

  // 답변 이메일 전송
  const sendReplyEmail = useCallback(async () => {
    if (!selectedInquiry) return

    try {
      setSendingReply(true)
      
      const emailData: EmailData = {
        inquiryId: selectedInquiry.id,
        to: replyEmail,
        subject: replySubject,
        message: replyMessage,
        inquiryName: selectedInquiry.name
      }

      await emailApi.sendReply(emailData)

      // 답변 완료로 상태 업데이트
      await updateInquiryStatus(selectedInquiry.id, { 
        responded: true, 
        status: 'in-progress' 
      })

      alert('Reply email sent successfully!')
      setIsReplyModalOpen(false)
      setReplyEmail('')
      setReplySubject('')
      setReplyMessage('')
    } catch (err) {
      console.error('Error sending reply email:', err)
      alert('Failed to send reply email. Please try again.')
    } finally {
      setSendingReply(false)
    }
  }, [selectedInquiry, replyEmail, replySubject, replyMessage, updateInquiryStatus])

  // 필터링된 문의 목록
  const filteredInquiries = filterInquiries(inquiries, searchTerm, filter)

  // 초기 데이터 로드
  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Total: {inquiries.length} inquiries
              </span>
              <button
                onClick={fetchInquiries}
                className="btn-primary text-sm px-4 py-2"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex gap-2">
              {(['all', ...INQUIRY_STATUSES] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : getStatusDisplayText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className={`hover:bg-gray-50 ${!inquiry.read ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClasses(inquiry.status)}`}>
                          {getStatusDisplayText(inquiry.status)}
                        </span>
                        {!inquiry.read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        {inquiry.responded && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Replied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        {inquiry.company && (
                          <div className="text-sm text-gray-500">{inquiry.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {inquiry.message}
                        </div>
                        {inquiry.service && (
                          <div className="text-xs text-gray-500 mt-1">
                            Service: {inquiry.service}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openInquiry(inquiry)}
                          className="text-primary-600 hover:text-primary-900"
                          title="View inquiry details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openReplyModal(inquiry)}
                          className="text-green-600 hover:text-green-900"
                          disabled={inquiry.responded}
                          title="Send reply email"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete inquiry"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No inquiries found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Inquiry from {selectedInquiry.name}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.service || 'Not selected'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => updateInquiryStatus(selectedInquiry.id, { status: e.target.value as InquiryStatus })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      title="Select inquiry status"
                    >
                      {INQUIRY_STATUSES.map(status => (
                        <option key={status} value={status}>
                          {getStatusDisplayText(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Add internal notes..."
                    title="Add internal notes for this inquiry"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, { responded: !selectedInquiry.responded })}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        selectedInquiry.responded
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {selectedInquiry.responded ? 'Mark as Unresponded' : 'Mark as Responded'}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNotes}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Email Modal */}
      {isReplyModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Send Reply to {selectedInquiry.name}
                </h3>
                <button
                  onClick={() => setIsReplyModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close reply modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <input
                    type="email"
                    value={replyEmail}
                    onChange={(e) => setReplyEmail(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    readOnly
                    title="Recipient email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    title="Email subject line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={8}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Type your reply message..."
                    title="Type your reply message to the customer"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsReplyModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReplyEmail}
                    disabled={sendingReply}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
