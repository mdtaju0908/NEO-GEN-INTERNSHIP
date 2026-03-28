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
    applied: 'bg-blue-50 text-blue-700 border-blue-100',
    reviewing: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    shortlisted: 'bg-purple-50 text-purple-700 border-purple-100',
    interview: 'bg-orange-50 text-orange-700 border-orange-100',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejected: 'bg-red-50 text-red-700 border-red-100',
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="text-blue-600" />
              My Applications
            </h1>
            <p className="text-gray-500 mt-1">Track the status of your internship applications.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search applications..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm transition-colors">
                <Filter size={20} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company & Role
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date Applied
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                    <motion.tr 
                      key={app._id || app.id} 
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-100">
                              {app.companyLogo || <Building size={20} className="text-gray-400" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{app.role || app.internship?.title || 'Internship Role'}</div>
                            <div className="text-sm text-gray-500">{app.company || app.internship?.company || 'Company Name'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {new Date(app.createdAt || app.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </motion.tr>
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
             <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredApplications.length}</span> of <span className="font-medium">{applications?.length || 0}</span> results
                </div>
                <div className="flex-1 flex justify-end gap-2">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
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
