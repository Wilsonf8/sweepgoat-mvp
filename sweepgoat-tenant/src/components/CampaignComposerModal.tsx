import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface CampaignComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientCount: number;
  emailVerifiedFilter: 'all' | 'verified' | 'unverified';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface FormData {
  name: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  subject?: string;
  message?: string;
}

export function CampaignComposerModal({
  isOpen,
  onClose,
  recipientCount,
  emailVerifiedFilter,
  sortBy,
  sortOrder,
}: CampaignComposerModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSending, setIsSending] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Insert variable at cursor position in message
  const insertVariable = (variable: string) => {
    const textarea = messageRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.message;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newMessage = before + variable + after;
    setFormData({ ...formData, message: newMessage });

    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      textarea.focus();
    }, 0);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send campaign
  const handleSend = async () => {
    if (!validateForm()) return;

    if (recipientCount === 0) {
      setErrors({ message: 'No recipients selected. Please select users from the CRM page.' });
      return;
    }

    setIsSending(true);

    try {
      const requestBody = {
        name: formData.name,
        type: 'EMAIL',
        subject: formData.subject,
        message: formData.message,
        emailVerified: emailVerifiedFilter === 'all' ? null : emailVerifiedFilter === 'verified',
        sortBy,
        sortOrder,
      };

      await api.post('/api/host/campaigns/send', requestBody);

      // Success - close modal and redirect
      onClose();
      navigate('/host/campaigns');
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      setErrors({
        message: error.response?.data?.message || 'Failed to send campaign. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Cancel and reset
  const handleCancel = () => {
    setFormData({ name: '', subject: '', message: '' });
    setErrors({});
    onClose();
  };

  // Generate preview message with sample data
  const generatePreview = () => {
    return formData.message
      .replace(/\{\{firstName\}\}/g, 'John')
      .replace(/\{\{lastName\}\}/g, 'Doe')
      .replace(/\{\{hostCompanyName\}\}/g, 'Your Company')
      .replace(/\{\{subdomain\}\}/g, 'yourcompany');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={handleCancel}></div>

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-light text-white">Launch Campaign</h2>
          <button
            onClick={handleCancel}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Recipient Count */}
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-white font-light">
              Sending to <span className="font-medium">{recipientCount}</span> user{recipientCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Campaign Name */}
          <div className="mb-4">
            <label className="block text-xs font-light text-zinc-400 uppercase tracking-wider mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Holiday Promotion 2024"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm font-light rounded focus:border-zinc-600 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Message Type */}
          <div className="mb-4">
            <label className="block text-xs font-light text-zinc-400 uppercase tracking-wider mb-2">
              Message Type
            </label>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white text-black rounded text-sm font-light">
                Email
              </button>
              <button
                disabled
                className="px-4 py-2 bg-zinc-800 text-zinc-600 rounded text-sm font-light cursor-not-allowed"
              >
                SMS (Coming Soon)
              </button>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-xs font-light text-zinc-400 uppercase tracking-wider mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., {{firstName}}, Check Your Giveaway Status!"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm font-light rounded focus:border-zinc-600 focus:outline-none"
            />
            {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
          </div>

          {/* Message Body */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-light text-zinc-400 uppercase tracking-wider">
                Message
              </label>
              <div className="text-xs text-zinc-500 font-light">
                Insert variables:
              </div>
            </div>

            {/* Variable Buttons */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => insertVariable('{{firstName}}')}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded text-xs font-light transition-colors"
              >
                {'{{firstName}}'}
              </button>
              <button
                type="button"
                onClick={() => insertVariable('{{lastName}}')}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded text-xs font-light transition-colors"
              >
                {'{{lastName}}'}
              </button>
              <button
                type="button"
                onClick={() => insertVariable('{{hostCompanyName}}')}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded text-xs font-light transition-colors"
              >
                {'{{hostCompanyName}}'}
              </button>
              <button
                type="button"
                onClick={() => insertVariable('{{subdomain}}')}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded text-xs font-light transition-colors"
              >
                {'{{subdomain}}'}
              </button>
            </div>

            <textarea
              ref={messageRef}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hi {{firstName}},&#10;&#10;We have exciting news...&#10;&#10;Visit https://{{subdomain}}.sweepgoat.com&#10;&#10;Thanks,&#10;{{hostCompanyName}}"
              rows={8}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm font-light rounded focus:border-zinc-600 focus:outline-none font-mono"
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>

          {/* Preview */}
          {formData.message && (
            <div className="mb-4">
              <label className="block text-xs font-light text-zinc-400 uppercase tracking-wider mb-2">
                Preview (Sample Data)
              </label>
              <div className="p-4 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300 font-light whitespace-pre-wrap font-mono">
                {generatePreview()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={isSending}
            className="px-6 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || recipientCount === 0}
            className="px-6 py-2 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}