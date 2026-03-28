import React from 'react';
import { MapPin, Clock, DollarSign, Briefcase, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Skeleton } from '../../ui/Skeleton';
import { motion } from 'framer-motion';

const InternshipCard = ({ job, loading, index }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 w-full">
            <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
            {job.logo || '🏢'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1">{job.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-1">{job.company}</p>
          </div>
        </div>
        {job.matchScore && (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center border border-emerald-100">
            <Star size={12} className="mr-1 fill-current" />
            {job.matchScore}% Match
          </span>
        )}
      </div>
  
      <div className="flex flex-wrap gap-2 mb-6 text-sm text-gray-500">
        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <MapPin size={14} className="mr-1.5 text-gray-400" /> {job.location}
        </span>
        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <Clock size={14} className="mr-1.5 text-gray-400" /> {job.duration}
        </span>
        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <DollarSign size={14} className="mr-1.5 text-gray-400" /> {job.stipend}
        </span>
        <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
          <Briefcase size={14} className="mr-1.5 text-gray-400" /> {job.type}
        </span>
      </div>
  
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-medium">Posted {job.postedAt}</span>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-sm font-medium text-white bg-gray-900 hover:bg-black px-4 py-2 rounded-xl transition-colors shadow-sm group-hover:shadow-md"
        >
          Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useStudentDashboard } from '../../../context/StudentDashboardContext';

const Recommendations = () => {
  const { dashboardData, loading } = useStudentDashboard();
  const navigate = useNavigate();
  const recommendations = dashboardData?.recommendedInternships || [];
  
  const onNavigate = (path) => {
     if (path === 'profile') {
         navigate('/dashboard/profile');
     } else {
         navigate(path);
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-amber-500 fill-amber-500" />
              Recommended for You
            </h1>
            <p className="text-gray-500 mt-1">AI-curated internships based on your profile and skills.</p>
        </div>
        <select className="border border-gray-200 rounded-xl text-sm px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <option>Sort by Match Score</option>
            <option>Newest First</option>
            <option>Highest Stipend</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <InternshipCard key={i} loading={true} />
          ))}
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((job, idx) => (
            <InternshipCard key={idx} job={job} index={idx} />
          ))}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Briefcase size={40} className="text-gray-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">No recommendations yet</h3>
             <p className="text-gray-500 mt-2 mb-8 max-w-md mx-auto">
                We need more information about your skills and preferences to find the best matches.
             </p>
             <button 
                onClick={() => onNavigate && onNavigate('profile')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
             >
                 Update Profile
             </button>
        </motion.div>
      )}
    </div>
  );
};

export default Recommendations;
