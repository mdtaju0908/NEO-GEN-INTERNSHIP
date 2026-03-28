import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2, XCircle, Award, Target, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';
import { Skeleton } from '../../ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

import { useStudentDashboard } from '../../../context/StudentDashboardContext';

const ATSResume = () => {
  const { atsScoreData, onResumeUploadSuccess: onUploadSuccess, loadingAtsScore: loading } = useStudentDashboard();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  const score = atsScoreData?.score || 0;
  console.log('Current atsScoreData:', atsScoreData);
  console.log('Displayed score:', score);
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // emerald-500
    if (score >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const scoreColor = getScoreColor(score);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading and analyzing resume...');

    try {
        const formData = new FormData();
        formData.append('resume', file);
        if (jobDescription.trim()) {
            formData.append('jobDescription', jobDescription);
        }
        
        console.log('Uploading resume with jobDescription:', jobDescription || 'none');
        const response = await api.post('/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log('Upload response:', response.data);
        if (onUploadSuccess) {
            onUploadSuccess(response.data);
        }
        toast.success('Resume analyzed successfully!', { id: toastId });
    } catch (err) {
        console.error("Upload error", err);
        toast.error('Failed to upload resume. Please try again.', { id: toastId });
    } finally {
        setIsUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
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
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              ATS Resume Checker
            </h1>
            <p className="text-gray-500 mt-1">Optimize your resume to pass Applicant Tracking Systems.</p>
        </div>
        {atsScoreData && !atsScoreData.isDemoData && (
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
             >
                <Download size={16} className="mr-2" />
                Download Report
             </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
            <div 
                className={clsx(
                    "bg-white rounded-2xl shadow-sm border-2 border-dashed p-10 flex flex-col items-center justify-center transition-all duration-300 h-full min-h-[350px] relative overflow-hidden group",
                    dragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50/50",
                    isUploading ? "opacity-75 pointer-events-none" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-white p-4 rounded-full shadow-md">
                                <Loader2 size={48} className="text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 mt-6">Analyzing your resume...</p>
                        <p className="text-gray-500 mt-2">This usually takes a few seconds.</p>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Upload size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">2. Upload your resume</h3>
                        <p className="text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                            Drag and drop your resume here, or click to browse. <br/>
                            <span className="text-xs text-gray-400 mt-2 block">Supported formats: PDF, DOC, DOCX (Max 10MB)</span>
                        </p>
                        
                        <label className="relative cursor-pointer">
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md inline-block"
                            >
                                Select Resume File
                            </motion.span>
                            <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.doc,.docx" />
                        </label>
                    </>
                )}
            </div>
        </motion.div>

        {/* Score Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={120} />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                ATS Score
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center mb-6">
                <div className="relative w-56 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[{ value: score }, { value: 100 - score }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill={scoreColor} />
                                <Cell fill="#f3f4f6" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                            className="text-5xl font-black text-gray-900 tracking-tighter"
                        >
                            {score}
                        </motion.span>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Out of 100</span>
                    </div>
                </div>
                
                <div className="mt-2 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className={clsx("inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border", {
                            "bg-green-50 text-green-700 border-green-200": score >= 80,
                            "bg-yellow-50 text-yellow-700 border-yellow-200": score >= 60 && score < 80,
                            "bg-red-50 text-red-700 border-red-200": score < 60
                        })}
                    >
                        {score >= 80 ? "Excellent Profile" : score >= 60 ? "Good Start" : "Needs Improvement"}
                    </motion.div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Technical Skills</span>
                        <span className="font-bold text-gray-900">{atsScoreData?.breakdown?.technical || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${atsScoreData?.breakdown?.technical || 0}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-blue-500 h-2 rounded-full" 
                        />
                    </div>
                </div>
                
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">Formatting</span>
                        <span className="font-bold text-gray-900">{atsScoreData?.breakdown?.formatting || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${atsScoreData?.breakdown?.formatting || 0}%` }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="bg-purple-500 h-2 rounded-full" 
                        />
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Missing Skills */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Missing Skills
            </h3>
            <p className="text-gray-500 text-sm mb-6">
                These keywords are commonly required for your target role but were not found in your resume.
            </p>
            
            {atsScoreData?.missingKeywords?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {atsScoreData.missingKeywords.map((skill, index) => (
                        <motion.span 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-1.5 hover:bg-red-100 transition-colors cursor-default"
                        >
                            <XCircle size={14} />
                            {skill}
                        </motion.span>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <CheckCircle className="text-green-500 mb-2" size={32} />
                    <p className="text-gray-900 font-medium">No missing skills detected!</p>
                    <p className="text-gray-500 text-sm">Your resume covers all the key requirements.</p>
                </div>
            )}
        </motion.div>

        {/* Matched Skills */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Matched Skills
            </h3>
            <p className="text-gray-500 text-sm mb-6">
                Great job! These required skills were successfully detected in your resume.
            </p>
            
            {atsScoreData?.matchedKeywords?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {atsScoreData.matchedKeywords.map((skill, index) => (
                        <motion.span 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-1.5 hover:bg-green-100 transition-colors cursor-default"
                        >
                            <CheckCircle size={14} />
                            {skill}
                        </motion.span>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <AlertCircle className="text-gray-400 mb-2" size={32} />
                    <p className="text-gray-900 font-medium">No matched skills found</p>
                    <p className="text-gray-500 text-sm">Try adding more relevant keywords to your resume.</p>
                </div>
            )}
        </motion.div>
      </div>

      {/* Suggestions Section */}
      {atsScoreData?.suggestions?.length > 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="text-amber-500" size={20} />
                  Improvement Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {atsScoreData.suggestions.map((suggestion, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start p-4 bg-amber-50 rounded-xl border border-amber-100 hover:shadow-sm transition-shadow"
                      >
                          <div className="bg-amber-100 p-2 rounded-lg mr-3 flex-shrink-0">
                            <AlertCircle size={18} className="text-amber-600" />
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed pt-1">{suggestion}</p>
                      </motion.div>
                  ))}
              </div>
          </motion.div>
      )}
    </motion.div>
  );
};

export default ATSResume;
