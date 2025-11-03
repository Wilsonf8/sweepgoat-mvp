import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../services/api';

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  general?: string;
}

export function HostCreateGiveawayPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Image URL is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    // Validate end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post('/api/host/giveaways', {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      // Redirect to giveaway detail page
      navigate(`/host/giveaways/${response.data.id}`);
    } catch (error: any) {
      console.error('Error creating giveaway:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create giveaway. Please try again.';

      // Check if it's the "max 1 active giveaway" error
      if (
        errorMessage.toLowerCase().includes('active') ||
        errorMessage.toLowerCase().includes('only')
      ) {
        setErrors({
          general:
            'You can only run 1 active giveaway at a time. End current giveaway first.',
        });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Create New Giveaway</h1>
          <p className="text-zinc-500 font-light">
            Fill out the details below to create a new giveaway
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="p-4 border border-red-500 bg-red-500/10 rounded">
              <p className="text-sm text-red-400 font-light">{errors.general}</p>
            </div>
          )}

          {/* Title */}
          <Input
            label="Title"
            value={formData.title}
            onChange={handleChange('title')}
            error={errors.title}
            placeholder="Enter giveaway title"
            required
          />

          {/* Description */}
          <div className="w-full">
            <label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description')(e.target.value)}
              placeholder="Enter giveaway description"
              rows={4}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm font-light rounded focus:border-zinc-700 focus:outline-none resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-2">{errors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChange={handleChange('imageUrl')}
            error={errors.imageUrl}
            placeholder="https://example.com/image.jpg"
            required
          />

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="w-full">
              <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
                Preview
              </p>
              <div className="w-full max-w-md border border-zinc-800 rounded-lg overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Invalid image URL';
                  }}
                />
              </div>
            </div>
          )}

          {/* Start Date */}
          <div className="w-full">
            <label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
              Start Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate')(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm font-light rounded focus:border-zinc-700 focus:outline-none"
            />
            {errors.startDate && (
              <p className="text-xs text-red-400 mt-2">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div className="w-full">
            <label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
              End Date & Time <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate')(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm font-light rounded focus:border-zinc-700 focus:outline-none"
            />
            {errors.endDate && (
              <p className="text-xs text-red-400 mt-2">{errors.endDate}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              Create Giveaway
            </Button>
            <button
              type="button"
              onClick={() => navigate('/host/giveaways')}
              className="px-6 py-3 bg-zinc-800 text-white hover:bg-zinc-700 rounded transition-colors text-sm font-light"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}