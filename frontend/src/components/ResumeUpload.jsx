import React, { useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { saveResumeToStorage } from '../utils/storageUtils';
import '../styles/resumeUpload.css';

const ResumeUpload = ({ onUploadSuccess, isLoading = false, currentResume = null }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const ALLOWED_TYPES = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    const validateFile = (file) => {
        // Check file size
        if (file.size > MAX_SIZE) {
            return 'File size must be less than 10MB';
        }

        // Check file type
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
        const isValidType = ALLOWED_TYPES.some(type => file.type.includes(type.split('/')[1]));

        if (!isValidExt && !isValidType) {
            return 'Please upload a PDF, DOC, or DOCX file';
        }

        return null;
    };

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

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFile = async (file) => {
        setError('');
        setSuccess('');

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Upload file
        await uploadResume(file);
    };

    const uploadResume = async (file) => {
        try {
            // Mock ATS Analysis Data
            const mockData = {
                resumeUploaded: true,
                resumeId: 'mock-resume-id-' + Date.now(),
                score: 72,
                breakdown: {
                    technical: 75,
                    softSkills: 68,
                    experience: 60,
                    education: 80,
                    completeness: 85,
                    formatting: 90,
                    contact: 100
                },
                suggestions: [
                    "Add more quantitative results to your experience section",
                    "Include keywords from the job description",
                    "Highlight leadership roles in your projects"
                ],
                matchedKeywords: ["JavaScript", "React", "Node.js", "Teamwork", "Problem Solving"],
                missingKeywords: ["Python", "AWS", "Docker"],
                sections: {
                    hasSummary: true,
                    hasExperience: true,
                    hasEducation: true,
                    hasSkills: true,
                    hasProjects: true,
                    hasContact: true
                },
                extractedSkills: ["JavaScript", "React", "Node.js", "HTML", "CSS", "Git", "Agile"]
            };

            // Simulate network delay slightly for better UX (optional, but "instantly" was requested)
            // User said "Demo data should render instantly without API delay", so no delay.

            setSuccess('Resume uploaded and analyzed successfully!');
            setUploadProgress(100);

            // Save resume data to localStorage
            const resumeStorage = {
                ...mockData,
                uploadedAt: new Date().toISOString(),
                fileName: file.name,
                fileSize: file.size,
                isMock: true
            };
            saveResumeToStorage(resumeStorage, file.name);

            // Call parent callback with safe data
            if (onUploadSuccess) {
                onUploadSuccess(resumeStorage);
            }

            // Reset progress after 2 seconds
            setTimeout(() => setUploadProgress(0), 2000);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload resume. Please try again.');
            setUploadProgress(0);
        }
    };

    return (
        <div className="resume-upload-container">
            <div className="upload-box">
                <div
                    className={`drag-drop-area ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="resumeInput"
                        className="file-input"
                        onChange={handleChange}
                        accept=".pdf,.doc,.docx"
                        disabled={isLoading}
                    />

                    <label htmlFor="resumeInput" className="upload-label">
                        <div className="upload-icon">
                            <Upload size={48} />
                        </div>
                        <h3>Upload Your Resume</h3>
                        <p className="main-text">
                            Drag and drop your resume here or click to browse
                        </p>
                        <p className="sub-text">
                            Supported: PDF, DOC, DOCX (Max 10MB)
                        </p>
                    </label>

                    {isLoading && (
                        <div className="loading-overlay">
                            <Loader size={32} className="spinner" />
                            <p>Analyzing your resume...</p>
                        </div>
                    )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <CheckCircle size={20} />
                        <span>{success}</span>
                    </div>
                )}

                {currentResume && (
                    <div className="current-resume">
                        <div className="resume-info">
                            <File size={24} />
                            <div>
                                <p className="resume-name">{currentResume.fileName}</p>
                                <p className="resume-date">
                                    Uploaded: {new Date(currentResume.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            className="btn-update"
                            onClick={() => document.getElementById('resumeInput').click()}
                            disabled={isLoading}
                        >
                            Update Resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
