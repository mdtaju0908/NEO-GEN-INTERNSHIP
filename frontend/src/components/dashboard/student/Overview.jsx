import React from 'react';
import { Briefcase, FileText, UserCheck, CheckCircle, TrendingUp, ArrowRight, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';

const StatCard = ({ title, value, label, icon: Icon, color, trend, loading }) => (
  <Card noPadding className="border-l-4 border-l-transparent hover:border-l-green-500 transition-all duration-300">
    <div className="p-6">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
              <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {trend ? (
              <span className="text-green-600 font-medium flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                <TrendingUp size={14} className="mr-1" />
                {trend}
              </span>
            ) : (
              <span className="text-gray-400 font-medium">
                  {label}
              </span>
            )}
            <span className="text-gray-400 ml-2 text-xs">{trend ? 'vs last month' : ''}</span>
          </div>
        </>
      )}
    </div>
  </Card>
);

const ActivityItem = ({ title, company, time, status }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-4 -mx-4 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
        {company.substring(0, 2).toUpperCase()}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{company} • {time}</p>
      </div>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
      status === 'Applied' ? 'bg-blue-50 text-blue-700 border-blue-100' :
      status === 'Interview' ? 'bg-purple-50 text-purple-700 border-purple-100' :
      status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
      'bg-green-50 text-green-700 border-green-100'
    }`}>
      {status}
    </span>
  </div>
);

import { useNavigate } from 'react-router-dom';
import { useStudentDashboard } from '../../../context/StudentDashboardContext';

const Overview = () => {
  const { dashboardData, profileData, loading } = useStudentDashboard();
  const navigate = useNavigate();

  const onNavigate = (path) => {
    if (path === 'find-internship') {
        navigate('/find-internship');
    } else {
        navigate(`/dashboard/${path}`);
    }
  };
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-[1200px] mx-auto pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profileData?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your job search today.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => onNavigate('profile')} 
                className="btn-primary text-sm flex items-center shadow-lg shadow-green-200"
            >
                Update Profile
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
            <StatCard 
            title="Applications" 
            value={dashboardData?.totalApplications || 0}
            label="Total sent"
            icon={Briefcase}
            color="text-blue-600 bg-blue-600"
            trend="+12%"
            loading={loading}
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatCard 
            title="ATS Score" 
            value={dashboardData?.atsScore || 0}
            label="Resume strength"
            icon={FileText}
            color="text-purple-600 bg-purple-600"
            trend={dashboardData?.atsScore > 70 ? "Good" : "Needs Work"}
            loading={loading}
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatCard 
            title="Profile" 
            value={`${profileData?.profileCompletionPercentage || 0}%`}
            label="Completion rate"
            icon={UserCheck}
            color="text-orange-600 bg-orange-600"
            trend={profileData?.profileCompletionPercentage < 100 ? "Incomplete" : "Complete"}
            loading={loading}
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatCard 
            title="Interviews" 
            value={dashboardData?.interviews || 0}
            label="Scheduled"
            icon={CheckCircle}
            color="text-green-600 bg-green-600"
            trend="Active"
            loading={loading}
            />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <Card 
                title="Application Activity" 
                subtitle="Your recent job applications and their status"
                action={
                    <button 
                        onClick={() => onNavigate('applications')}
                        className="text-sm text-green-600 font-medium hover:text-green-700 flex items-center"
                    >
                        View All <ArrowRight size={16} className="ml-1" />
                    </button>
                }
            >
                <div className="flex flex-col">
                    {[1, 2, 3].map((i) => (
                        <ActivityItem 
                            key={i}
                            title={`Frontend Developer Intern #${i}`}
                            company="Tech Corp Inc."
                            time={`${i} day${i > 1 ? 's' : ''} ago`}
                            status={i === 1 ? 'Interview' : 'Applied'}
                        />
                    ))}
                </div>
            </Card>

            <Card title="Recommended for You" subtitle="Based on your skills and profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                    🚀
                                </div>
                                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">New</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">React Developer</h4>
                            <p className="text-sm text-gray-500 mb-3">Startup Inc. • Remote</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="flex items-center"><Clock size={12} className="mr-1"/> 2d ago</span>
                                <span>•</span>
                                <span className="flex items-center"><Award size={12} className="mr-1"/> $500/mo</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </motion.div>

        {/* Right Sidebar - Pro Tips & Progress */}
        <motion.div variants={itemVariants} className="space-y-6">
            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-none">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Award size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Pro Tip!</h3>
                        <p className="text-green-50 text-sm mt-1 leading-relaxed">
                            Completing your profile and adding verified skills increases your visibility to recruiters by 40%.
                        </p>
                        <button 
                            onClick={() => onNavigate('profile')}
                            className="mt-4 bg-white text-green-700 text-xs font-bold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
                        >
                            Complete Profile
                        </button>
                    </div>
                </div>
            </Card>

            <Card title="Profile Strength">
                <div className="flex flex-col items-center py-4">
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#f3f4f6"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#16a34a"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={351.86}
                                strokeDashoffset={351.86 * (1 - (profileData?.profileCompletionPercentage || 0) / 100)}
                                className="transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-gray-900">{profileData?.profileCompletionPercentage || 0}%</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mb-4">
                        Your profile is doing great! Add a few more details to reach 100%.
                    </p>
                </div>
            </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
