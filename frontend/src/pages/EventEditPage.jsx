import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Upload, Image, Clock, FileText, Building2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const EventEditPage = () => {
  const [event, setEvent] = useState(null);
  const [venues, setVenues] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [eventError, setEventError] = useState(null);
  const [venuesError, setVenuesError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: null,
    venue: '',
    fromTime: '',
    toTime: '',
    club: ''
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [existingBanner, setExistingBanner] = useState(null);
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;
  
  // Get event ID from URL (assuming it's passed as a prop or from URL params)
  // For this example, we'll use a placeholder - in real implementation, get from useParams() or props
  const eventId = useParams().id;

  useEffect(() => {
    fetchEvent();
    fetchVenues();
  }, []);

  const fetchEvent = async () => {
    try {
      setEventLoading(true);
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }

      const eventData = await response.json();
      setEvent(eventData);
      
      // Pre-fill form with existing data
      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        banner: null, // We'll handle existing banner separately
        venue: eventData.venue?._id || eventData.venue || '',
        fromTime: eventData.fromTime ? new Date(eventData.fromTime).toISOString().slice(0, 16) : '',
        toTime: eventData.toTime ? new Date(eventData.toTime).toISOString().slice(0, 16) : '',
        club: eventData.club || ''
      });

      // Set existing banner if available
      if (eventData.banner) {
        setExistingBanner(`${API_URL}/events/${eventId}/banner`);
      }

    } catch (err) {
      setEventError(err.message);
    } finally {
      setEventLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      setVenuesLoading(true);
      const response = await fetch(`${API_URL}/events/venues`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }

      const data = await response.json();
      setVenues(data);
    } catch (err) {
      setVenuesError(err.message);
    } finally {
      setVenuesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit messages when user makes changes
    if (submitError || submitSuccess) {
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          banner: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          banner: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        banner: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
        setExistingBanner(null); // Hide existing banner when new one is selected
      };
      reader.readAsDataURL(file);

      // Clear banner error
      if (errors.banner) {
        setErrors(prev => ({
          ...prev,
          banner: ''
        }));
      }
    }
  };

  const removeBanner = () => {
    setFormData(prev => ({ ...prev, banner: null }));
    setBannerPreview(null);
    // Don't restore existing banner when removing new selection
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.venue) {
      newErrors.venue = 'Please select a venue';
    }

    if (!formData.fromTime) {
      newErrors.fromTime = 'Start time is required';
    }

    if (!formData.toTime) {
      newErrors.toTime = 'End time is required';
    }

    if (!formData.club.trim()) {
      newErrors.club = 'Club name is required';
    }

    // Validate time logic
    if (formData.fromTime && formData.toTime) {
      const fromTime = new Date(formData.fromTime);
      const toTime = new Date(formData.toTime);
      
      if (fromTime >= toTime) {
        newErrors.toTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('fromTime', formData.fromTime);
      formDataToSend.append('toTime', formData.toTime);
      formDataToSend.append('club', formData.club);
      
      if (formData.banner) {
        formDataToSend.append('banner', formData.banner);
      }

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Room is already booked during that time. Please select a different time slot or venue.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update event');
      }

      setSubmitSuccess(true);
      
      // Refresh event data to show updated information
      setTimeout(() => {
        fetchEvent();
        setSubmitSuccess(false);
      }, 3000);

    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Loading event details...</div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-xl mb-2">Error loading event</div>
          <div className="text-gray-400 mb-4">{eventError}</div>
          <button 
            onClick={fetchEvent}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b-2 border-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Event</h1>
              <p className="text-gray-400 mt-2">Update your event details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Event updated successfully!</span>
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{submitError}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Banner Upload Section */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-red-500" />
              Event Banner
            </h2>
            
            <div className="space-y-4">
              {bannerPreview ? (
                <div className="relative">
                  <img 
                    src={bannerPreview} 
                    alt="Banner preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : existingBanner ? (
                <div className="relative">
                  <img 
                    src={existingBanner} 
                    alt="Current banner" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Current Banner
                  </div>
                </div>
              ) : null}
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-750 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold">Click to upload new banner</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </label>
              
              {errors.banner && (
                <p className="text-red-400 text-sm">{errors.banner}</p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              Event Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Club */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter club name"
                />
                {errors.club && (
                  <p className="text-red-400 text-sm mt-1">{errors.club}</p>
                )}
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue *
                </label>
                {venuesLoading ? (
                  <div className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400">
                    Loading venues...
                  </div>
                ) : venuesError ? (
                  <div className="w-full px-3 py-2 bg-red-900 border border-red-700 rounded-lg text-red-400">
                    Error loading venues
                  </div>
                ) : (
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a venue</option>
                    {venues.map((venue) => (
                      <option key={venue._id} value={venue._id}>
                        {venue.venueName} (Capacity: {venue.capacity})
                      </option>
                    ))}
                  </select>
                )}
                {errors.venue && (
                  <p className="text-red-400 text-sm mt-1">{errors.venue}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter event description"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="fromTime"
                  value={formData.fromTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {errors.fromTime && (
                  <p className="text-red-400 text-sm mt-1">{errors.fromTime}</p>
                )}
              </div>

              {/* To Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="toTime"
                  value={formData.toTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {errors.toTime && (
                  <p className="text-red-400 text-sm mt-1">{errors.toTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Event...
                </>
              ) : (
                'Update Event'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventEditPage;