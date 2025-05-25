import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Users, UserCheck, TrendingUp, Clock, Award, Calendar, Rss } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AnalyticsPage = () => {
  const { eventId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [eventId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/events/analytics/${eventId}/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    primary: '#dc2626', // red-600
    secondary: '#991b1b', // red-800
    accent: '#fca5a5', // red-300
    dark: '#1f2937', // gray-800
    light: '#374151', // gray-700
    text: '#f9fafb', // gray-50
    muted: '#9ca3af' // gray-400
  };

  const PIE_COLORS = ['#dc2626', '#991b1b', '#7f1d1d', '#fca5a5', '#f87171'];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <div className="bg-gray-800 border border-red-600/20 rounded-lg p-6 hover:border-red-600/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="bg-red-600/20 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-red-500" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-500 text-sm">{trend}</span>
        </div>
      )}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-red-600/30 rounded-lg p-3 shadow-lg">
          <p className="text-gray-200 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-red-300">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600/20 border border-red-600/40 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/20 to-black border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600/20 p-3 rounded-lg">
              <Award className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{analytics.eventInfo.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatEventDate(analytics.eventInfo.fromTime)}</span>
                </div>
                <span>to</span>
                <span>{formatEventDate(analytics.eventInfo.toTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Registrants"
            value={analytics.basicStats.totalRegistrants.toLocaleString()}
            subtitle="People registered for the event"
          />
          <StatCard
            icon={UserCheck}
            title="Total Attendees"
            value={analytics.basicStats.totalAttendees.toLocaleString()}
            subtitle="People who checked in"
          />
          <StatCard
            icon={TrendingUp}
            title="Attendance Rate"
            value={`${analytics.basicStats.attendancePercentage}%`}
            subtitle="Check-in percentage"
            trend={analytics.basicStats.attendancePercentage > 70 ? "Excellent turnout!" : "Good turnout"}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gender Distribution */}
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 text-red-500 mr-2" />
              Gender Distribution
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Registrants</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.distributions.gender.registrants}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="count"
                      nameKey="gender"
                    >
                      {analytics.distributions.gender.registrants.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Attendees</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.distributions.gender.attendees}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="count"
                      nameKey="gender"
                    >
                      {analytics.distributions.gender.attendees.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Check-in Time Distribution */}
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 text-red-500 mr-2" />
              Check-in Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.checkinTimeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#dc2626" 
                  strokeWidth={3}
                  dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch and YOG Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Branch Distribution */}
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Branch-wise Distribution</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Registrants vs Attendees</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.distributions.branch.registrants.map(reg => {
                    const attendee = analytics.distributions.branch.attendees.find(att => att.branch === reg.branch);
                    return {
                      branch: reg.branch,
                      registrants: reg.count,
                      attendees: attendee ? attendee.count : 0
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="branch" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="registrants" fill="#fca5a5" name="Registrants" />
                    <Bar dataKey="attendees" fill="#dc2626" name="Attendees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Year of Graduation Distribution */}
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Year of Graduation Distribution</h3>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Registrants vs Attendees</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.distributions.yog.registrants.map(reg => {
                  const attendee = analytics.distributions.yog.attendees.find(att => att.yog === reg.yog);
                  return {
                    yog: reg.yog,
                    registrants: reg.count,
                    attendees: attendee ? attendee.count : 0
                  };
                })}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="yog" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="registrants" fill="#fca5a5" name="Registrants" />
                  <Bar dataKey="attendees" fill="#dc2626" name="Attendees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400">Top Branch (Registrants)</h4>
            <p className="text-lg font-bold text-white mt-1">
              {analytics.distributions.branch.registrants[0]?.branch || 'N/A'}
            </p>
            <p className="text-sm text-red-400">
              {analytics.distributions.branch.registrants[0]?.count || 0} people
            </p>
          </div>
          
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400">Top Branch (Attendees)</h4>
            <p className="text-lg font-bold text-white mt-1">
              {analytics.distributions.branch.attendees[0]?.branch || 'N/A'}
            </p>
            <p className="text-sm text-red-400">
              {analytics.distributions.branch.attendees[0]?.count || 0} people
            </p>
          </div>
          
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400">Peak Check-in Hour</h4>
            <p className="text-lg font-bold text-white mt-1">
              {analytics.checkinTimeDistribution.reduce((max, slot) => 
                slot.count > max.count ? slot : max, { count: 0, hour: 'N/A' }
              ).hour}
            </p>
            <p className="text-sm text-red-400">
              {analytics.checkinTimeDistribution.reduce((max, slot) => 
                slot.count > max.count ? slot : max, { count: 0 }
              ).count} check-ins
            </p>
          </div>
          
          <div className="bg-gray-800 border border-red-600/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400">Most Common YOG</h4>
            <p className="text-lg font-bold text-white mt-1">
              {analytics.distributions.yog.registrants[0]?.yog || 'N/A'}
            </p>
            <p className="text-sm text-red-400">
              {analytics.distributions.yog.registrants[0]?.count || 0} people
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;