import { api } from './api';

const resumeService = {
    /**
     * Upload resume for ATS analysis
     * @param {File} file - Resume file (PDF, DOC, DOCX)
     * @param {string} [jobDescription] - Optional job description for better analysis
     * @returns {Promise<Object>} Analysis result with score and recommendations
     */
    uploadResume: async (file, jobDescription = '') => {
        try {
            const formData = new FormData();
            formData.append('resume', file);
            if (jobDescription) {
                formData.append('jobDescription', jobDescription);
            }

            const response = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get latest resume score and analysis
     * @returns {Promise<Object>} Resume analysis data
     */
    getResumeScore: async () => {
        try {
            const response = await api.get('/resume/score');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get ATS-based internship recommendations
     * @returns {Promise<Object>} List of recommended internships with match scores
     */
    getRecommendations: async () => {
        try {
            const response = await api.get('/resume/recommendations');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Delete resume
     * @param {string} resumeId - Resume ID
     * @returns {Promise<Object>} Success message
     */
    deleteResume: async (resumeId) => {
        try {
            const response = await api.delete(`/resume/${resumeId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default resumeService;
