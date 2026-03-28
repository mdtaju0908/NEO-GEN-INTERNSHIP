import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Skeleton } from '../../ui/Skeleton';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react';

import { useStudentDashboard } from '../../../context/StudentDashboardContext';

const Analytics = () => {
  const { loading } = useStudentDashboard();
  // Mock Data
  const applicationData = [
    { month: 'Jan', applied: 2, shortlisted: 0 },
    { month: 'Feb', applied: 5, shortlisted: 1 },
    { month: 'Mar', applied: 8, shortlisted: 3 },
    { month: 'Apr', applied: 12, shortlisted: 4 },
    { month: 'May', applied: 15, shortlisted: 6 },
    { month: 'Jun', applied: 20, shortlisted: 8 },
  ];

  const atsScoreData = [
    { version: 'v1', score: 45 },
    { version: 'v2', score: 58 },
    { version: 'v3', score: 72 },
    { version: 'v4', score: 85 },
  ];

  const skillDemandData = [
    { skill: 'React', demand: 85, yourLevel: 70 },
    { skill: 'Node.js', demand: 75, yourLevel: 60 },
    { skill: 'Python', demand: 65, yourLevel: 40 },
    { skill: 'Design', demand: 50, yourLevel: 80 },
    { skill: 'SQL', demand: 60, yourLevel: 50 },
  ];

  if (loading) {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
            </div>
        </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 capitalize">{entry.name}:</span>
              <span className="font-bold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Analytics & Insights
        </h1>
        <p className="text-gray-500 mt-1">Visualize your progress and market trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications Over Time */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={20} />
                  Application Performance
              </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorShortlisted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area 
                    type="monotone" 
                    dataKey="applied" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorApplied)" 
                    name="Applied" 
                    animationDuration={1500}
                />
                <Area 
                    type="monotone" 
                    dataKey="shortlisted" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorShortlisted)" 
                    name="Shortlisted" 
                    animationDuration={1500}
                    animationBegin={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ATS Score Improvement */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart2 className="text-purple-500" size={20} />
                  ATS Score Improvement
              </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={atsScoreData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="version" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={4} 
                    dot={{r: 6, fill: '#8b5cf6', strokeWidth: 3, stroke: '#fff'}} 
                    activeDot={{r: 8}} 
                    animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Demand vs Your Profile */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="text-amber-500" size={20} />
                  Market Skill Demand vs Your Profile
              </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDemandData} barSize={32} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="skill" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                    dataKey="demand" 
                    fill="#3b82f6" 
                    name="Market Demand" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={1500}
                />
                <Bar 
                    dataKey="yourLevel" 
                    fill="#fbbf24" 
                    name="Your Proficiency" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={1500}
                    animationBegin={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
