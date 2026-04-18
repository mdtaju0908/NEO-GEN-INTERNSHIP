import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Calendar, Building, Briefcase, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Skeleton } from '../../ui/Skeleton';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../ui/EmptyState';

const StatusBadge = ({ status }) => {
  const styles = {
    applied: 'bg-navy-light text-navy border-navy/20',
    reviewing: 'bg-saffron-light text-saffron-hover border-saffron/20',
    shortlisted: 'bg-gradient-to-r from-saffron to-saffron-hover text-white border-saffron',
    interview: 'bg-saffron-light text-saffron border-saffron/30',
    accepted: 'bg-green-light text-green-primary border-green-primary/30',
    rejected: 'bg-red-50 text-red-600 border-red-200',
  };

  const statusKey = status?.toLowerCase() || 'applied';
  const className = styles[statusKey] || styles.applied;

  return (
    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>
      {status || 'Applied'}
    </span>
  );
};

import { useStudentDashboard } from '../../../context/StudentDashboardContext';

const Applications = () => {
  const navigate = useNavigate();
  const { applications, loading } = useStudentDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Selected'];

  const getStageIndex = (status) => {
    if(!status) return 0;
    const s = status.toLowerCase();
    if(s === 'applied' || s === 'viewed') return 0;
    if(s === 'shortlisted' || s === 'under review') return 1;
    if(s === 'interview') return 2;
    if(s === 'selected' || s === 'accepted') return 3;
    if(s === 'rejected') return -1;
    return 0;
  };

  // Filter applications based on search term
  const filteredApplications = applications?.filter(app => {
    const term = searchTerm.toLowerCase();
    return (
      app.company?.toLowerCase().includes(term) ||
      app.role?.toLowerCase().includes(term) ||
      app.internship?.title?.toLowerCase().includes(term) ||
      app.internship?.company?.toLowerCase().includes(term)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Briefcase className="text-saffron" />
              My Applications
            </h1>
            <p className="text-sub mt-1">Track the status of your internship applications.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/40" />
                <input 
                    type="text" 
                    placeholder="Search applications..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-navy/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron shadow-sm transition-all"
                />
            </div>
            <button className="p-2 bg-white/50 border border-navy/10 rounded-xl hover:bg-saffron/10 hover:text-saffron text-navy/60 shadow-sm transition-colors">
                <Filter size={20} />
            </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-navy/5">
            <thead className="bg-navy-light/30">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-navy/70 uppercase tracking-wider">
                  Company & Role
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-navy/70 uppercase tracking-wider">
                  Date Applied
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-navy/70 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-navy/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/40 divide-y divide-navy/5">
              {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                  <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                                  <div className="space-y-2">
                                      <Skeleton className="h-4 w-32" />
                                      <Skeleton className="h-3 w-24" />
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <Skeleton className="h-6 w-20 rounded-full" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                          </td>
                      </tr>
                  ))
              ) : filteredApplications && filteredApplications.length > 0 ? (
                <AnimatePresence>
                  {filteredApplications.map((app, index) => (
                    <React.Fragment key={app._id || app.id}>
                    <motion.tr 
                      className="hover:bg-gradient-to-r hover:from-saffron/5 hover:to-transparent transition-colors group cursor-pointer"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-saffron/10 to-green-primary/10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-navy/5">
                              {app.companyLogo || <Building size={20} className="text-saffron-hover/70" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-navy">{app.role || app.internship?.title || 'Internship Role'}</div>
                            <div className="text-sm text-sub">{app.company || app.internship?.company || 'Company Name'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-sub">
                          <Calendar size={16} className="mr-2 text-saffron/70" />
                          {new Date(app.createdAt || app.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                           onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                           className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </motion.tr>
                    {expandedId === app._id && (
                        <tr className="bg-gradient-to-r from-saffron/5 to-transparent">
                          <td colSpan="4" className="px-8 py-6 border-b border-navy/5">
                             <div className="w-full">
                                <h4 className="text-sm font-bold text-navy mb-4 tracking-wide uppercase">Application Tracker</h4>
                                <div className="flex items-center justify-between relative">
                                   {/* Connecting Line */}
                                   <div className="absolute left-0 top-1/2 w-full h-1 bg-navy/10 -z-10 -translate-y-1/2 rounded-full"></div>
                                   
                                   {STAGES.map((stage, idx) => {
                                      const currentIndex = getStageIndex(app.status);
                                      const isCompleted = currentIndex >= idx && currentIndex !== -1;
                                      const isRejected = currentIndex === -1;
                                      
                                      return (
                                        <div key={idx} className="flex flex-col items-center bg-white/70 backdrop-blur-md shadow-sm px-4 rounded-full border border-navy/5">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                                            isRejected ? 'border-red-500 bg-red-100 text-red-600' :
                                            isCompleted ? 'border-saffron bg-saffron text-white shadow-md' : 'border-navy/20 bg-navy/5 text-navy/40'
                                          }`}>
                                              {isCompleted ? '✓' : idx + 1}
                                          </div>
                                          <span className={`text-xs mt-2 font-bold ${isCompleted ? 'text-navy' : 'text-sub'}`}>
                                            {isRejected && idx === 3 ? 'Rejected' : stage}
                                          </span>
                                        </div>
                                      );
                                   })}
                                </div>
                             </div>
                          </td>
                       </tr>
                    )}
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                    <td colSpan="4" className="px-6 py-12">
                        <EmptyState 
                            title="No applications found"
                            message={searchTerm ? `No results for "${searchTerm}"` : "Start applying to internships to see them here."}
                            actionLabel={!searchTerm ? "Browse Internships" : null}
                            onAction={!searchTerm ? () => navigate('/find-internships') : null}
                        />
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
         {filteredApplications && filteredApplications.length > 0 && (
             <div className="bg-white/30 px-4 py-3 border-t border-navy/5 flex items-center justify-between sm:px-6">
                <div className="text-sm text-navy/70">
                    Showing <span className="font-bold">1</span> to <span className="font-bold">{filteredApplications.length}</span> of <span className="font-bold">{applications?.length || 0}</span> results
                </div>
                <div className="flex-1 flex justify-end gap-2">
                    <button className="relative inline-flex items-center px-4 py-2 border border-navy/10 text-sm font-bold rounded-lg text-navy bg-white/50 hover:bg-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-navy/10 text-sm font-bold rounded-lg text-navy bg-white/50 hover:bg-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
             </div>
        )}
      </div>
    </motion.div>
  );
};

export default Applications;
