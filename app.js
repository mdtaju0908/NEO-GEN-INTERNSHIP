// Enhanced Neogen Government Internship Portal - JavaScript

// Application State
// Utility: Detect language using LibreTranslate
async function detectLanguage(text) {
    try {
        const res = await fetch('https://libretranslate.de/detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text })
        });
        const data = await res.json();
        if (data && data.length > 0) return data[0].language;
    } catch (e) {}
    return 'en';
}

// Utility: Translate text using LibreTranslate
async function translateText(text, targetLang, sourceLang = 'auto') {
    if (!text || targetLang === sourceLang) return text;
    try {
        const res = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            })
        });
        const data = await res.json();
        return data.translatedText || text;
    } catch (e) {
        return text;
    }
}
const appState = {
    currentUser: null,
    currentPage: 'landing',
    currentDashboardSection: 'overview',
    internships: [],
    filteredInternships: [],
    userProfile: {
        profilePicture: 'https://i.pravatar.cc/100?u=default',
        fullName: '',
        email: '',
        university: '',
        fieldOfStudy: ''
    },
    matchedInternships: [],
    currentFormStep: 1,
    selectedSkills: [],
    chatbotOpen: false,
    atsScore: null,
    userApplications: [],
    notifications: [],
    formProgress: {},
    resourceProgress: {},
    savedInternships: [],
    // chatbotLanguage removed
};

const STORAGE_KEYS = {
    savedInternships: 'neogen_saved_internships_v1'
};

// Data from JSON
const applicationData = {
    "latest_notifications": [
        {
            "id": 1,
            "title": "PM Internship Scheme 2025 - Extended Deadline",
            "message": "Application deadline extended to April 22, 2025. Over 1 lakh internship opportunities available across 730 districts with ₹6,000 monthly stipend.",
            "type": "urgent",
            "category": "deadline",
            "date": "2025-04-14",
            "link": "https://www.pminternship.mca.gov.in/",
            "icon": "calendar",
            "priority": "high"
        },
        {
            "id": 2,
            "title": "MEA Internship 2025-26 Term I Notice Released",
            "message": "Ministry of External Affairs has announced the timeline for MEA Internship Program 2025 Term I. Applications opening soon with ₹10,000 monthly honorarium.",
            "type": "new",
            "category": "opportunity",
            "date": "2025-02-20",
            "link": "https://internship.mea.gov.in/internship",
            "icon": "globe",
            "priority": "high"
        },
        {
            "id": 3,
            "title": "MeitY Technical Internship Programme 2025",
            "message": "Ministry of Electronics & IT announces Technical Internship Programme 2025. Last date for applications: June 15, 2025.",
            "type": "new",
            "category": "tech",
            "date": "2025-01-04",
            "link": "https://www.meity.gov.in/",
            "icon": "laptop",
            "priority": "medium"
        },
        {
            "id": 4,
            "title": "NITI Aayog Monthly Application Window",
            "message": "NITI Aayog internship applications are open from 1-10 of every month. Apply now for policy research opportunities.",
            "type": "recurring",
            "category": "policy",
            "date": "2025-09-25",
            "link": "http://niti.gov.in/internship",
            "icon": "briefcase",
            "priority": "medium"
        }
    ],
    "government_partners": {
        "central_ministries": [
            {
                "name": "Ministry of Electronics & IT (MeitY)",
                "website": "https://www.meity.gov.in",
                "programs": ["Digital India Internship", "Technical Internship Programme"]
            },
            {
                "name": "NITI Aayog",
                "website": "https://niti.gov.in",
                "programs": ["Policy Research Internship", "Data Analytics Program"]
            },
            {
                "name": "Ministry of External Affairs",
                "website": "https://mea.gov.in",
                "programs": ["Diplomacy Internship", "Foreign Policy Research"]
            },
            {
                "name": "ISRO",
                "website": "https://www.isro.gov.in",
                "programs": ["Space Technology Internship", "Satellite Engineering"]
            }
        ],
        "implementing_agencies": [
            {
                "name": "AICTE",
                "website": "https://internship.aicte-india.org",
                "programs": ["Technical Education Internships"]
            },
            {
                "name": "Skill India Digital",
                "website": "https://www.skillindiadigital.gov.in",
                "programs": ["Skill Development Programs"]
            },
            {
                "name": "National Career Service",
                "website": "https://www.ncs.gov.in",
                "programs": ["Career Guidance", "Job Matching"]
            }
        ]
    },
    "resource_guides": {
        "getting_started": {
            "title": "Getting Started Guide",
            "description": "Complete beginner's guide to finding and applying for government internships",
            "difficulty": "Beginner",
            "estimated_time": "15 minutes",
            "sections": [
                {
                    "title": "Understanding Government Internships",
                    "content": "Learn about different types of government internships, eligibility criteria, and benefits",
                    "duration": "5 min read",
                    "difficulty": "Beginner"
                },
                {
                    "title": "Creating Your Profile",
                    "content": "Step-by-step guide to setting up your Neogen profile for maximum visibility",
                    "duration": "10 min read", 
                    "difficulty": "Beginner"
                }
            ]
        },
        "application_process": {
            "title": "Application Process Mastery",
            "description": "Master the art of government internship applications",
            "difficulty": "Intermediate",
            "estimated_time": "45 minutes",
            "sections": [
                {
                    "title": "Research & Preparation",
                    "content": "How to research organizations, understand requirements, and prepare applications",
                    "duration": "20 min read",
                    "difficulty": "Intermediate"
                },
                {
                    "title": "Resume Optimization",
                    "content": "Government-specific resume writing tips and ATS optimization strategies",
                    "duration": "25 min read",
                    "difficulty": "Intermediate"
                }
            ]
        },
        "advanced_strategies": {
            "title": "Advanced Application Strategies",
            "description": "Advanced techniques for competitive government positions",
            "difficulty": "Advanced",
            "estimated_time": "60 minutes",
            "sections": [
                {
                    "title": "Interview Preparation",
                    "content": "Comprehensive guide to government interview processes",
                    "duration": "30 min read",
                    "difficulty": "Advanced"
                },
                {
                    "title": "Networking & Mentorship",
                    "content": "Building professional networks in government sector",
                    "duration": "30 min read",
                    "difficulty": "Advanced"
                }
            ]
        }
    },
    "internships": [
        {
            "id": 1,
            "title": "NITI Aayog Internship Program",
            "organization": "NITI Aayog",
            "department": "Planning Commission",
            "duration": "6-8 weeks",
            "stipend": "Unpaid (Certificate provided)",
            "location": "New Delhi",
            "application_deadline": "10th of every month",
            "eligibility": "UG/PG/Research scholars from recognized universities",
            "min_percentage": "75%",
            "fields": ["Economics", "Finance", "Governance", "Data Analytics", "Law", "Public Policy"],
            "description": "Work closely with NITI's verticals/divisions/cells on policy research and analysis",
            "apply_link": "https://niti.gov.in/internship",
            "status": "Active"
        },
        {
            "id": 2,
            "title": "Ministry of External Affairs (MEA) Internship",
            "organization": "Ministry of External Affairs", 
            "department": "Foreign Affairs",
            "duration": "6 weeks",
            "stipend": "₹10,000 + Travel allowance",
            "location": "New Delhi",
            "application_deadline": "Monthly basis",
            "eligibility": "Indian citizens under 25, UG/PG students",
            "min_percentage": "70%",
            "fields": ["International Relations", "Diplomacy", "Foreign Policy", "Political Science"],
            "description": "Learn diplomacy, foreign policy, and international relations at MEA headquarters",
            "apply_link": "https://internship.mea.gov.in/internship",
            "status": "Active"
        }
    ]
};

// Sample additional data
const sampleData = {
    studentReviews: [
        {
            "id": 1,
            "name": "Priya Sharma",
            "university": "Delhi University",
            "course": "Economics",
            "internship": "NITI Aayog Internship Program",
            "rating": 5,
            "review": "Amazing experience! The AI matching system perfectly aligned my skills with the NITI Aayog internship. The platform made the entire application process seamless.",
            "date": "2025-08-15",
            "verified": true,
            "profile_image": "https://i.pravatar.cc/150?img=1"
        },
        {
            "id": 2,
            "name": "Arjun Patel",
            "university": "IIT Bombay",
            "course": "Computer Science",
            "internship": "MeitY Digital India Internship",
            "rating": 5,
            "review": "Neogen's platform is a game-changer! The resume ATS scoring helped me optimize my application. Got selected for Digital India program on first try!",
            "date": "2025-09-01",
            "verified": true,
            "profile_image": "https://i.pravatar.cc/150?img=2"
        },
        {
            "id": 3,
            "name": "Sneha Reddy",
            "university": "Osmania University",
            "course": "Political Science",
            "internship": "MEA Internship",
            "rating": 4,
            "review": "Great platform with excellent customer support. The chatbot was very helpful in guiding me through the application process. Highly recommend!",
            "date": "2025-08-28",
            "verified": true,
            "profile_image": "https://i.pravatar.cc/150?img=3"
        },
        {
            "id": 4,
            "name": "Ankish Kumar",
            "university": "VGU University",
            "course": "AI ML Developer",
            "internship": "India AI ML Program",
            "rating": 5,
            "review": "I got the India AI ML internship through the Neogen platform. As a graduate of VGU University, the guidance here helped me a lot in my career. Thank you Neogen!",
            "date": "2025-10-01",
            "verified": true,
            "profile_image": "exported-assets/ankish-profile.jpg"
        }
    ]
};

// Skills database for autocomplete
const skillsDatabase = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular', 'Vue.js',
    'Data Analysis', 'Machine Learning', 'Artificial Intelligence', 'Deep Learning',
    'Public Policy', 'Research', 'Legal Research', 'Constitutional Law', 'Finance',
    'Economics', 'Banking', 'Accounting', 'Auditing', 'Project Management',
    'Communication', 'Leadership', 'Team Work', 'Problem Solving', 'Critical Thinking',
    'International Relations', 'Diplomacy', 'Foreign Policy', 'Political Science',
    'Space Technology', 'Aerospace Engineering', 'Mechanical Engineering',
    'Electronics', 'Computer Science', 'Cybersecurity', 'Digital India',
    'E-Governance', 'Human Rights', 'Social Work', 'Government Audit',
    'Defence Technology', 'Rocket Science', 'Satellite Engineering'
];

// Chatbot responses database
const chatbotResponses = {
    greetings: [
        "Hello! I'm here to help you with government internships. What would you like to know?",
        "Hi there! How can I assist you with your internship search today?",
        "Welcome! I'm your NEO GEN AI assistant. What can I help you with?"
    ],
    internship_help: [
        "I can help you find internships that match your profile. Have you completed your profile yet?",
        "To find the best internships for you, I'd recommend using our AI matching system. Would you like me to guide you through it?",
        "There are several government internships available. What field are you interested in?"
    ],
    application_help: [
        "For applications, make sure your profile is complete and your resume has a good ATS score. Need help with either?",
        "The application process is simple: complete your profile, find matches, and apply directly. Which step do you need help with?",
        "I can guide you through the application process step by step. Where would you like to start?"
    ],
    ats_help: [
        "ATS score measures how well your resume works with automated systems. You can check yours in the dashboard!",
        "A good ATS score increases your chances of getting shortlisted. Upload your resume to get detailed feedback.",
        "ATS optimization is crucial for government applications. Our AI can analyze your resume and suggest improvements."
    ],
    general_help: [
        "I'm here to help with any questions about the platform, internships, or applications. What do you need?",
        "Feel free to ask me about internship opportunities, application tips, or platform navigation!",
        "I can assist with platform features, internship matching, or general guidance. What interests you?"
    ]
};

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Page Management
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        appState.currentPage = pageId.replace('Page', '');
    }
    
    // Update navigation
    updateNavigation();
    
    // Load page-specific content
    if (pageId === 'dashboardPage') {
        loadDashboard();
    } else if (pageId === 'findInternshipPage') {
        loadFormProgress();
    }
}

function updateNavigation() {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === appState.currentPage) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`Navigated to section`, 'info');
    }
}

// Enhanced Authentication System
function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}Tab`).classList.add('active');
}

function simulateGoogleAuth(isSignup = false) {
    // Simulate enhanced Google OAuth verification
    showToast('Connecting to Google OAuth...', 'info');
    
    setTimeout(() => {
        showToast('Verifying credentials...', 'info');
        
        setTimeout(() => {
            const userData = {
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                profilePicture: null,
                verified: true,
                authMethod: 'google'
            };
            
            loginUser(userData);
            hideLoginModal();
            showToast(`Successfully ${isSignup ? 'signed up' : 'logged in'} with enhanced Google verification!`, 'success');
        }, 1500);
    }, 1000);
}

function loginUser(userData) {
    appState.currentUser = userData;
    
    // Initialize user profile
    if (!appState.userProfile.fullName) {
        appState.userProfile = {
            ...appState.userProfile,
            fullName: userData.name,
            email: userData.email
        };
    }
    
    // Update UI
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('userName').textContent = userData.name;
    
    // Update avatar if available
    if (userData.profilePicture) {
        document.getElementById('userAvatar').src = userData.profilePicture;
    }
    
    // Update dashboard if on dashboard page
    if (appState.currentPage === 'dashboard') {
        loadDashboard();
    }
}

function logoutUser() {
    appState.currentUser = null;
    appState.userProfile = {};
    appState.selectedSkills = [];
    appState.atsScore = null;
    appState.userApplications = [];
    appState.formProgress = {};
    
    // Reset UI
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('signupBtn').style.display = 'block';
    document.getElementById('userProfile').classList.add('hidden');
    document.getElementById('profileMenu').classList.add('hidden');
    
    // Reset form and show landing page
    showPage('landingPage');
    showToast('Successfully logged out!', 'info');
}

// Enhanced Notifications System
function renderNotifications(filter = '') {
    const container = document.getElementById('notificationsList');
    const notifications = applicationData.latest_notifications;
    const filtered = filter ? notifications.filter(n => n.type === filter) : notifications;
    
    // Update summary counts
    const urgentCount = notifications.filter(n => n.priority === 'high').length;
    const newCount = notifications.filter(n => n.type === 'new').length;
    const recurringCount = notifications.filter(n => n.type === 'recurring').length;
    
    document.getElementById('urgentCount').textContent = urgentCount;
    document.getElementById('newCount').textContent = newCount;
    document.getElementById('recurringCount').textContent = recurringCount;
    
    // Update chip counts and active state
    const chipAll = document.getElementById('chip-all');
    if (chipAll) chipAll.textContent = notifications.length;
    const chipUrgent = document.getElementById('chip-urgent');
    if (chipUrgent) chipUrgent.textContent = urgentCount;
    const chipNew = document.getElementById('chip-new');
    if (chipNew) chipNew.textContent = newCount;
    const chipRecurring = document.getElementById('chip-recurring');
    if (chipRecurring) chipRecurring.textContent = recurringCount;
    
    document.querySelectorAll('.notification-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filter);
    });
    
    if (!filtered.length) {
        container.innerHTML = `
            <div class="no-results">
                <h4>No notifications in this filter</h4>
                <p>Try switching to All or refresh for the latest updates.</p>
                <button class="btn btn--outline btn--sm" onclick="refreshNotifications()">Refresh</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(notification => `
        <div class="notification-item priority-${notification.priority}" data-type="${notification.type}" onclick="openNotification('${notification.link}')">
            <div class="notification-icon">
                ${getNotificationIcon(notification.icon)}
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-meta">
                    <span class="notification-date">${formatDate(notification.date)}</span>
                    <div class="notification-actions">
                        <button class="btn btn--outline btn--sm" onclick="event.stopPropagation(); viewNotificationDetails(${notification.id})">
                            View Details
                        </button>
                        <button class="btn btn--primary btn--sm" onclick="event.stopPropagation(); openNotification('${notification.link}')">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
            <div class="notification-badge" id="badge-${notification.id}"></div>
        </div>
    `).join('');
}

function getNotificationIcon(icon) {
    const icons = {
        calendar: '📅',
        globe: '🌐',
        laptop: '💻',
        briefcase: '💼'
    };
    return icons[icon] || '📢';
}

function filterNotifications(filterValue) {
    const filter = filterValue !== undefined ? filterValue : document.getElementById('notificationFilter').value;
    renderNotifications(filter);
    const label = filter ? filter : 'all';
    showToast(`Filtered notifications: ${label}`, 'info');
}

function refreshNotifications() {
    showToast('Refreshing notifications...', 'info');
    
    setTimeout(() => {
        renderNotifications();
        showToast('Notifications refreshed successfully!', 'success');
    }, 1000);
}

function openNotification(link) {
    window.open(link, '_blank');
}

function viewNotificationDetails(id) {
    const notification = applicationData.latest_notifications.find(n => n.id === id);
    showToast(`Viewing details for: ${notification.title}`, 'info');
}

function markAllNotificationsRead() {
    document.querySelectorAll('.notification-badge').forEach(badge => {
        badge.classList.add('read');
    });
    showToast('All notifications marked as read', 'info');
}

// Enhanced Resource Guides System
function renderResourceGuides() {
    const container = document.getElementById('resourceGuidesGrid');
    const guides = applicationData.resource_guides;
    
    container.innerHTML = Object.entries(guides).map(([key, guide]) => `
        <div class="resource-guide-card" data-difficulty="${guide.difficulty.toLowerCase()}">
            <div class="resource-header">
                <h3 class="resource-title">${guide.title}</h3>
                <span class="resource-difficulty">${guide.difficulty}</span>
                <p class="resource-description">${guide.description}</p>
            </div>
            <div class="resource-content">
                <div class="resource-sections">
                    ${guide.sections.map(section => `
                        <div class="resource-section">
                            <div class="section-title">${section.title}</div>
                            <div class="section-meta">
                                <span>${section.duration}</span>
                                <span>${section.difficulty}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="progress-indicator">
                    <div class="progress-fill" style="width: ${getResourceProgress(key)}%"></div>
                </div>
            </div>
            <div class="resource-actions">
                <button class="btn btn--primary" onclick="startResource('${key}')">
                    ${getResourceProgress(key) > 0 ? 'Continue' : 'Start'} Learning
                </button>
                <button class="btn btn--outline" onclick="downloadResource('${key}')">
                    📥 Download
                </button>
            </div>
        </div>
    `).join('');
}

function getResourceProgress(resourceKey) {
    return appState.resourceProgress[resourceKey] || 0;
}

function filterResourceGuides(category) {
    // Update active tab
    document.querySelectorAll('.resource-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('.resource-guide-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.difficulty === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function startResource(resourceKey) {
    const guide = applicationData.resource_guides[resourceKey];
    showToast(`Starting ${guide.title}...`, 'info');
    
    // Simulate progress
    if (!appState.resourceProgress[resourceKey]) {
        appState.resourceProgress[resourceKey] = 25;
        renderResourceGuides();
        showToast(`Progress saved for ${guide.title}!`, 'success');
    }
}

function downloadResource(resourceKey) {
    const guide = applicationData.resource_guides[resourceKey];
    showToast(`Downloading ${guide.title} resource guide...`, 'info');
}

// Government Partners Footer
function renderGovernmentPartners() {
    const centralContainer = document.getElementById('centralMinistriesLinks');
    const implementingContainer = document.getElementById('implementingAgenciesLinks');
    const partnerLogos = document.getElementById('partnerLogos');
    
    if (centralContainer) {
        centralContainer.innerHTML = applicationData.government_partners.central_ministries.map(ministry => `
            <li><a href="${ministry.website}" target="_blank">${ministry.name}</a></li>
        `).join('');
    }
    
    if (implementingContainer) {
        implementingContainer.innerHTML = applicationData.government_partners.implementing_agencies.map(agency => `
            <li><a href="${agency.website}" target="_blank">${agency.name}</a></li>
        `).join('');
    }
    
    if (partnerLogos) {
        const allPartners = [
            ...applicationData.government_partners.central_ministries,
            ...applicationData.government_partners.implementing_agencies
        ];
        // Render partner names only (no emblem images)
        partnerLogos.innerHTML = allPartners.map(partner => `
            <div class="partner-logo">
                <div class="partner-name">${partner.name}</div>
            </div>
        `).join('');
    }
}

// Enhanced Multi-Step Form System
function showFormStep(step) {
    // Update progress
    updateFormProgress(step);
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) {
            el.classList.add('completed');
        } else if (index + 1 === step) {
            el.classList.add('active');
        }
    });
    
    // Show/hide form steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    
    const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (activeStep) {
        activeStep.classList.add('active');
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const submitBtn = document.getElementById('submitForm');
    
    prevBtn.style.display = step > 1 ? 'block' : 'none';
    nextBtn.style.display = step < 5 ? 'block' : 'none';
    submitBtn.style.display = step === 5 ? 'block' : 'none';
    
    appState.currentFormStep = step;
    
    // Save progress
    saveFormProgress();
}

function updateFormProgress(step) {
    const percentage = (step / 5) * 100;
    const estimatedTimes = ['2 minutes', '3 minutes', '5 minutes', '3 minutes', '2 minutes'];
    
    document.getElementById('currentStep').textContent = step;
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('estimatedTime').textContent = estimatedTimes[step - 1];
}

function saveFormProgress() {
    if (!appState.currentUser) return;
    
    const formData = new FormData(document.getElementById('internshipForm'));
    appState.formProgress = {
        step: appState.currentFormStep,
        data: Object.fromEntries(formData.entries()),
        skills: [...appState.selectedSkills],
        timestamp: new Date().toISOString()
    };
    
    showToast('Progress saved successfully!', 'success');
}

function loadFormProgress() {
    if (appState.formProgress.step) {
        showFormStep(appState.formProgress.step);
        
        // Restore form data
        if (appState.formProgress.data) {
            Object.entries(appState.formProgress.data).forEach(([key, value]) => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = value;
                }
            });
        }
        
        // Restore skills
        if (appState.formProgress.skills) {
            appState.selectedSkills = [...appState.formProgress.skills];
            renderSelectedSkills();
        }
        
        showToast('Previous progress restored!', 'info');
    }
}

// Student Reviews Rendering
function renderStudentReviews() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;
    
    container.innerHTML = sampleData.studentReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">
                    <img src="${review.profile_image}" alt="${review.name}" />
                </div>
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <div class="review-university">${review.university}</div>
                    <div class="review-course">${review.course}</div>
                </div>
            </div>
            <div class="review-rating">
                ${Array(5).fill().map((_, i) => `
                    <span class="star ${i < review.rating ? '' : 'empty'}">★</span>
                `).join('')}
            </div>
            <div class="review-content">
                "${review.review}"
            </div>
            <div class="review-meta">
                <span>Applied for: ${review.internship}</span>
                ${review.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
            </div>
        </div>
    `).join('');
}

// Internship Management
function renderInternships(internships = appState.filteredInternships) {
    const grid = document.getElementById('internshipsGrid');
    
    if (internships.length === 0) {
        grid.innerHTML = '<div class="no-results"><p>No internships found matching your criteria.</p></div>';
        return;
    }
    
    grid.innerHTML = internships.map(internship => `
        <div class="internship-card">
            <div class="internship-header">
                <h3 class="internship-title">${internship.title}</h3>
                <div class="internship-org">${internship.organization}</div>
            </div>
            <div class="internship-details">
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${internship.department}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${internship.duration}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Stipend:</span>
                    <span class="detail-value stipend-value">${internship.stipend}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${internship.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Deadline:</span>
                    <span class="detail-value">${internship.application_deadline}</span>
                </div>
            </div>
            <div class="internship-fields">
                <span class="detail-label">Fields:</span>
                <div class="field-tags">
                    ${internship.fields.map(field => `<span class="field-tag">${field}</span>`).join('')}
                </div>
            </div>
            <div class="internship-description">
                ${internship.description}
            </div>
            <div class="internship-actions">
                <button class="btn btn--secondary" onclick="toggleSaveInternship(${internship.id})">
                    ${isInternshipSaved(internship.id) ? 'Saved' : 'Save'}
                </button>
                <button class="btn btn--primary" onclick="applyToInternship(${internship.id})">Apply Now</button>
                <a href="${internship.apply_link}" target="_blank" class="btn btn--outline">Official Link</a>
            </div>
        </div>
    `).join('');
}

function filterInternships() {
    const search = document.getElementById('searchInternships').value.toLowerCase();
    const department = document.getElementById('filterDepartment').value;
    const location = document.getElementById('filterLocation').value;
    
    appState.filteredInternships = appState.internships.filter(internship => {
        const matchesSearch = !search || 
            internship.title.toLowerCase().includes(search) ||
            internship.organization.toLowerCase().includes(search) ||
            internship.description.toLowerCase().includes(search) ||
            internship.fields.some(field => field.toLowerCase().includes(search));
        
        const matchesDepartment = !department || internship.department === department;
        const matchesLocation = !location || internship.location.includes(location);
        
        return matchesSearch && matchesDepartment && matchesLocation;
    });
    
    renderInternships();
}
// Saved Internships Management
function initSavedInternships() {
    try {
        const savedIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.savedInternships) || '[]');
        appState.savedInternships = savedIds
            .map(id => appState.internships.find(internship => internship.id === id))
            .filter(Boolean);
    } catch (e) {
        appState.savedInternships = [];
    }
}

function persistSavedInternships() {
    try {
        const savedIds = appState.savedInternships.map(internship => internship.id);
        localStorage.setItem(STORAGE_KEYS.savedInternships, JSON.stringify(savedIds));
    } catch (e) {
        // Best-effort persistence
    }
}

function isInternshipSaved(internshipId) {
    return appState.savedInternships.some(internship => internship.id === internshipId);
}

function toggleSaveInternship(internshipId) {
    const internship = appState.internships.find(i => i.id === internshipId);
    if (!internship) return;
    if (isInternshipSaved(internshipId)) {
        appState.savedInternships = appState.savedInternships.filter(i => i.id !== internshipId);
        showToast('Removed from saved internships', 'info');
    } else {
        appState.savedInternships = [internship, ...appState.savedInternships];
        showToast('Saved internship for later', 'success');
    }
    persistSavedInternships();
    renderInternships();
    renderMatchingResults(appState.matchedInternships || []);
    if (appState.currentDashboardSection === 'saved') {
        renderSavedInternships();
    }
}

function renderSavedInternships() {
    const container = document.getElementById('savedList');
    if (!container) return;

    if (!appState.savedInternships.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h4>No Saved Internships</h4>
                <p>Save promising opportunities to review and apply later.</p>
                <button class="btn btn--primary" onclick="showPage('landingPage')">Browse Internships</button>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.savedInternships.map(internship => `
        <div class="internship-card saved-card">
            <div class="internship-header">
                <h3 class="internship-title">${internship.title}</h3>
                <div class="internship-org">${internship.organization}</div>
            </div>
            <div class="internship-details">
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${internship.department}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${internship.duration}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${internship.location}</span>
                </div>
            </div>
            <div class="internship-description">
                ${internship.description}
            </div>
            <div class="internship-actions">
                <button class="btn btn--primary" onclick="applyToInternship(${internship.id})">Apply Now</button>
                <button class="btn btn--secondary" onclick="toggleSaveInternship(${internship.id})">Remove</button>
                <a href="${internship.apply_link}" target="_blank" class="btn btn--outline">Official Link</a>
            </div>
        </div>
    `).join('');
}


// Apply to an internship (requires login)
function applyToInternship(internshipId) {
    if (!appState.currentUser) {
        showLoginModal();
        showToast('Please login to apply for internships', 'info');
        return;
    }

    const internship = appState.internships.find(i => i.id === internshipId);
    if (!internship) {
        showToast('Internship not found', 'error');
        return;
    }

    const application = {
        id: Date.now(),
        internshipId,
        internshipTitle: internship.title,
        organization: internship.organization,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'pending'
    };

    appState.userApplications.push(application);
    showToast(`Application submitted for ${internship.title}!`, 'success');

    if (appState.currentPage === 'dashboardPage') {
        updateDashboardProfile();
        if (appState.currentDashboardSection === 'applications') {
            loadApplications();
        }
    }
}

// Dashboard Management
function loadDashboard() {
    if (!appState.currentUser) {
        showLoginModal();
        showToast('Please login to access your dashboard', 'info');
        return;
    }
    
    updateDashboardProfile();
    showDashboardSection('overview');
}

function updateDashboardProfile() {
    const user = appState.currentUser;
    const profile = appState.userProfile;
    
    // Update profile display
    document.getElementById('dashboardUserName').textContent = user.name;
    document.getElementById('dashboardUserEmail').textContent = user.email;
    document.getElementById('avatarInitials').textContent = generateInitials(user.name);
    
    // Calculate profile completion
    const totalFields = 10; // Total important fields
    const filledFields = Object.keys(profile).filter(key => profile[key] && profile[key] !== '').length;
    const completion = Math.round((filledFields / totalFields) * 100);
    
    document.getElementById('completionPercentage').textContent = `${completion}%`;
    document.getElementById('completionProgress').style.width = `${completion}%`;
    
    // Update metrics
    document.getElementById('totalApplications').textContent = appState.userApplications.length;
    document.getElementById('pendingApplications').textContent = appState.userApplications.filter(app => app.status === 'pending').length;
    document.getElementById('atsScore').textContent = appState.atsScore ? `${appState.atsScore}%` : '--';
    document.getElementById('profileMatches').textContent = appState.matchedInternships.length;
}

function showDashboardSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.dash-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    appState.currentDashboardSection = sectionId;
    
    // Load section-specific content
    if (sectionId === 'recommendations') {
        loadRecommendations();
    } else if (sectionId === 'profile') {
        loadProfileSettings();
    } else if (sectionId === 'applications') {
        loadApplications();
    } else if (sectionId === 'saved') {
        renderSavedInternships();
    }
}

function loadApplications() {
    const container = document.getElementById('applicationsList');
    
    if (appState.userApplications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h4>No Applications Yet</h4>
                <p>Start applying to internships to track them here.</p>
                <button class="btn btn--primary" onclick="showPage('findInternshipPage')">Find Internships</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.userApplications.map(app => `
        <div class="application-item">
            <h4>${app.internshipTitle}</h4>
            <p>${app.organization}</p>
            <div class="application-meta">
                <span>Applied: ${formatDate(app.appliedDate)}</span>
                <span class="status status--${app.status === 'pending' ? 'warning' : app.status === 'accepted' ? 'success' : 'error'}">
                    ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
            </div>
        </div>
    `).join('');
}

function loadRecommendations() {
    const container = document.getElementById('recommendationsList');
    
    if (appState.matchedInternships.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h4>No Recommendations Yet</h4>
                <p>Complete your profile to get personalized internship recommendations.</p>
                <button class="btn btn--primary" onclick="showPage('findInternshipPage')">Complete Profile</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.matchedInternships.slice(0, 3).map(internship => `
        <div class="internship-card">
            <div class="internship-header">
                <h3 class="internship-title">${internship.title}</h3>
                <div class="internship-org">${internship.organization}</div>
            </div>
            <div class="internship-details">
                <div class="detail-row">
                    <span class="detail-label">Match Score:</span>
                    <span class="detail-value">${internship.matchScore}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Stipend:</span>
                    <span class="detail-value stipend-value">${internship.stipend}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${internship.location}</span>
                </div>
            </div>
            <div class="internship-actions">
                <button class="btn btn--primary" onclick="applyToInternship(${internship.id})">Apply Now</button>
            </div>
        </div>
    `).join('');
}

function loadProfileSettings() {
    const profile = appState.userProfile;
    
    document.getElementById('profileName').value = profile.fullName || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profileUniversity').value = profile.university || '';
    document.getElementById('profileFieldOfStudy').value = profile.fieldOfStudy || '';
}

function updateProfile() {
    const profile = {
        fullName: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        university: document.getElementById('profileUniversity').value,
        fieldOfStudy: document.getElementById('profileFieldOfStudy').value
    };
    
    appState.userProfile = { ...appState.userProfile, ...profile };
    updateDashboardProfile();
    showToast('Profile updated successfully!', 'success');
}

// Skills Management
function showSkillSuggestions(query) {
    const suggestions = document.getElementById('skillsSuggestions');
    
    if (!query) {
        suggestions.style.display = 'none';
        return;
    }
    
    const filtered = skillsDatabase.filter(skill => 
        skill.toLowerCase().includes(query.toLowerCase()) &&
        !appState.selectedSkills.includes(skill)
    ).slice(0, 5);
    
    if (filtered.length > 0) {
        suggestions.innerHTML = filtered.map(skill => 
            `<div class="skill-suggestion" onclick="addSkill('${skill}')">${skill}</div>`
        ).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

function addSkill(skill) {
    if (!appState.selectedSkills.includes(skill)) {
        appState.selectedSkills.push(skill);
        renderSelectedSkills();
    }
    document.getElementById('skillInput').value = '';
    document.getElementById('skillsSuggestions').style.display = 'none';
}

function removeSkill(skill) {
    appState.selectedSkills = appState.selectedSkills.filter(s => s !== skill);
    renderSelectedSkills();
}

function renderSelectedSkills() {
    const container = document.getElementById('selectedSkills');
    container.innerHTML = appState.selectedSkills.map(skill => `
        <span class="skill-tag">
            ${skill}
            <button type="button" class="skill-remove" onclick="removeSkill('${skill}')">&times;</button>
        </span>
    `).join('');
}

// File Upload Handling
function handleFileUpload(file, type) {
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Please upload a PDF or Word document', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
    }
    
    // Update UI based on file type
    if (type === 'resume') {
        document.getElementById('resumeUploadArea').style.display = 'none';
        document.getElementById('resumeUploadedFile').classList.remove('hidden');
        document.getElementById('resumeFileName').textContent = file.name;
        document.getElementById('resumeFileSize').textContent = formatFileSize(file.size);
        appState.userProfile.resume = file;
    } else if (type === 'transcript') {
        document.getElementById('transcriptUploadArea').style.display = 'none';
        document.getElementById('transcriptUploadedFile').classList.remove('hidden');
        document.getElementById('transcriptFileName').textContent = file.name;
        document.getElementById('transcriptFileSize').textContent = formatFileSize(file.size);
        appState.userProfile.transcript = file;
    }
    
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`, 'success');
}

// ATS Score Checker
function handleATSUpload(file) {
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Please upload a PDF or Word document', 'error');
        return;
    }
    
    showToast('Analyzing your resume with AI...', 'info');
    
    setTimeout(() => {
        const atsScore = calculateATSScore(file);
        displayATSResults(atsScore);
        appState.atsScore = atsScore.overall;
        updateDashboardProfile();
    }, 3000);
}

function calculateATSScore(file) {
    const scores = {
        formatting: Math.floor(Math.random() * 30) + 70,
        keywords: Math.floor(Math.random() * 25) + 60,
        content: Math.floor(Math.random() * 30) + 65,
        completeness: Math.floor(Math.random() * 20) + 75
    };
    
    const overall = Math.round((scores.formatting + scores.keywords + scores.content + scores.completeness) / 4);
    
    return {
        overall,
        breakdown: scores,
        suggestions: generateATSSuggestions(scores)
    };
}

function generateATSSuggestions(scores) {
    const suggestions = [];
    
    if (scores.formatting < 80) {
        suggestions.push({
            icon: '📋',
            text: 'Improve resume formatting - use consistent fonts and clear section headers'
        });
    }
    
    if (scores.keywords < 75) {
        suggestions.push({
            icon: '🔑',
            text: 'Add more relevant keywords from the job descriptions you\'re targeting'
        });
    }
    
    if (scores.content < 80) {
        suggestions.push({
            icon: '📈',
            text: 'Include more quantifiable achievements and specific project details'
        });
    }
    
    if (scores.completeness < 85) {
        suggestions.push({
            icon: '✅',
            text: 'Ensure all sections (contact info, summary, experience, education) are complete'
        });
    }
    
    return suggestions;
}

function displayATSResults(results) {
    const container = document.getElementById('atsResults');
    
    container.innerHTML = `
        <div class="ats-score-display">
            <div class="ats-score-circle" style="background: conic-gradient(var(--color-primary) ${results.overall * 3.6}deg, var(--color-border) 0deg)">
                <div class="score-text">${results.overall}%</div>
            </div>
            <h4>Your ATS Score</h4>
            <p>${getScoreDescription(results.overall)}</p>
        </div>
        
        <div class="ats-breakdown">
            <div class="breakdown-item">
                <h4>Formatting</h4>
                <div class="breakdown-score">${results.breakdown.formatting}%</div>
                <div class="breakdown-description">Layout and structure</div>
            </div>
            <div class="breakdown-item">
                <h4>Keywords</h4>
                <div class="breakdown-score">${results.breakdown.keywords}%</div>
                <div class="breakdown-description">Relevant keywords</div>
            </div>
            <div class="breakdown-item">
                <h4>Content</h4>
                <div class="breakdown-score">${results.breakdown.content}%</div>
                <div class="breakdown-description">Quality and relevance</div>
            </div>
            <div class="breakdown-item">
                <h4>Completeness</h4>
                <div class="breakdown-score">${results.breakdown.completeness}%</div>
                <div class="breakdown-description">All required sections</div>
            </div>
        </div>
        
        <div class="ats-suggestions">
            <h4>💡 Improvement Suggestions</h4>
            <div class="suggestions-list">
                ${results.suggestions.map(suggestion => `
                    <div class="suggestion-item">
                        <div class="suggestion-icon">${suggestion.icon}</div>
                        <div class="suggestion-text">${suggestion.text}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
    document.getElementById('atsUploadArea').style.display = 'none';
    
    showToast(`ATS analysis complete! Your score: ${results.overall}%`, 'success');
}

function getScoreDescription(score) {
    if (score >= 90) return 'Excellent! Your resume is highly optimized for ATS systems.';
    if (score >= 80) return 'Good! Your resume should perform well with most ATS systems.';
    if (score >= 70) return 'Fair. Consider implementing the suggestions below to improve.';
    return 'Needs improvement. Focus on the areas highlighted below.';
}

// AI Chatbot Functions
// Translation utility removed
function openChatbot() {
    document.getElementById('chatbot').classList.remove('hidden');
    document.getElementById('chatbotToggle').style.display = 'none';
    appState.chatbotOpen = true;
    
    document.getElementById('chatbotInput').focus();
    // Language selector removed
}

function closeChatbot() {
    document.getElementById('chatbot').classList.add('hidden');
    document.getElementById('chatbotToggle').style.display = 'flex';
    appState.chatbotOpen = false;
}

function minimizeChatbot() {
    closeChatbot();
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    if (!message) return;
    addChatMessage(message, 'user');
    input.value = '';

    // Show loading message
    const loadingId = 'chatbot-loading-msg';
    addChatMessage('<span id="' + loadingId + '">...</span>', 'bot');

    (async () => {
        // Detect user language
        let userLang = await detectLanguage(message);
        let userMsg = message;
        // Always process in English for intent
        if (userLang !== 'en') {
            userMsg = await translateText(message, 'en', userLang);
        }
        let response = generateChatbotResponse(userMsg);
        // Translate bot response back to user language if needed
        if (userLang !== 'en') {
            response = await translateText(response, userLang, 'en');
        }
        // Replace loading message with actual response
        const messagesContainer = document.getElementById('chatbotMessages');
        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) {
            loadingElem.parentElement.innerHTML = response;
        } else {
            addChatMessage(response, 'bot');
        }
    })();
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatbotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(chatbotResponses.greetings);
    } else if (message.includes('internship') || message.includes('find') || message.includes('search')) {
        return getRandomResponse(chatbotResponses.internship_help);
    } else if (message.includes('apply') || message.includes('application')) {
        return getRandomResponse(chatbotResponses.application_help);
    } else if (message.includes('ats') || message.includes('resume') || message.includes('score')) {
        return getRandomResponse(chatbotResponses.ats_help);
    } else if (message.includes('help') || message.includes('support')) {
        return getRandomResponse(chatbotResponses.general_help);
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
        return "You can contact us at +91-11-2345-6789 or support@neogen.gov.in. You can also visit our Contact page for more options!";
    } else if (message.includes('dashboard') || message.includes('profile')) {
        return "Your dashboard shows your applications, ATS score, and recommendations. You can access it from the navigation menu after logging in!";
    } else {
        return "I'm here to help! You can ask me about finding internships, application process, ATS scores, or navigating the platform. What would you like to know?";
    }
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Form Submission and AI Matching
function handleFormSubmission(formData) {
    // Collect all form data
    appState.userProfile = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        address: formData.get('address'),
        degree: formData.get('degree'),
        fieldOfStudy: formData.get('fieldOfStudy'),
        university: formData.get('university'),
        yearOfStudy: formData.get('yearOfStudy'),
        cgpa: formData.get('cgpa'),
        specialization: formData.get('specialization'),
        languages: formData.get('languages'),
        certifications: formData.get('certifications'),
        projects: formData.get('projects'),
        preferredLocation: Array.from(formData.getAll('preferredLocation')),
        preferredDuration: formData.get('preferredDuration'),
        preferredDepartment: Array.from(formData.getAll('preferredDepartment')),
        workMode: formData.get('workMode'),
        motivation: formData.get('motivation'),
        skills: [...appState.selectedSkills],
        resume: appState.userProfile.resume,
        transcript: appState.userProfile.transcript
    };
    
    showToast('Analyzing your profile and finding matches...', 'info');
    
    setTimeout(() => {
        const matches = performAIMatching();
        renderMatchingResults(matches);
        showPage('matchingResultsPage');
        showToast(`Found ${matches.length} internship matches for you!`, 'success');
    }, 2000);
}

function performAIMatching() {
    const profile = appState.userProfile;
    
    const matches = appState.internships.map(internship => {
        const score = calculateMatchScore(internship, profile);
        const reasons = getMatchReasons(internship, profile, score);
        
        return {
            ...internship,
            matchScore: score,
            matchReasons: reasons
        };
    })
    .filter(match => match.matchScore >= 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
    
    appState.matchedInternships = matches;
    return matches;
}

function calculateMatchScore(internship, profile) {
    let score = 0;
    let maxScore = 0;
    
    // Skills matching
    const internshipFields = internship.fields.map(f => f.toLowerCase());
    const userSkills = profile.skills.map(s => s.toLowerCase());
    const fieldMatch = internshipFields.some(field => 
        userSkills.some(skill => skill.includes(field) || field.includes(skill))
    );
    
    if (fieldMatch) score += 40;
    maxScore += 40;
    
    // Academic background matching
    const fieldOfStudy = profile.fieldOfStudy?.toLowerCase() || '';
    const academicMatch = internshipFields.some(field => 
        fieldOfStudy.includes(field.toLowerCase()) || field.toLowerCase().includes(fieldOfStudy)
    );
    
    if (academicMatch) score += 30;
    maxScore += 30;
    
    // Location preference matching
    if (!profile.preferredLocation || profile.preferredLocation.length === 0 || 
        profile.preferredLocation.some(loc => internship.location.includes(loc))) {
        score += 15;
    }
    maxScore += 15;
    
    // Academic performance matching
    const minPercentage = parseFloat(internship.min_percentage?.replace('%', '')) || 0;
    const userPercentage = parseFloat(profile.cgpa) * 10;
    
    if (userPercentage >= minPercentage) score += 15;
    maxScore += 15;
    
    return Math.round((score / maxScore) * 100);
}

function getMatchReasons(internship, profile, score) {
    const reasons = [];
    
    const internshipFields = internship.fields.map(f => f.toLowerCase());
    const userSkills = profile.skills.map(s => s.toLowerCase());
    
    const matchingSkills = userSkills.filter(skill =>
        internshipFields.some(field => skill.includes(field) || field.includes(skill))
    );
    
    if (matchingSkills.length > 0) {
        reasons.push(`Your skills in ${matchingSkills.slice(0, 2).join(', ')} align with this role`);
    }
    
    const fieldOfStudy = profile.fieldOfStudy?.toLowerCase() || '';
    if (internshipFields.some(field => fieldOfStudy.includes(field.toLowerCase()))) {
        reasons.push(`Your academic background in ${profile.fieldOfStudy} is relevant`);
    }
    
    if (profile.preferredLocation && profile.preferredLocation.some(loc => internship.location.includes(loc))) {
        reasons.push(`Location matches your preferences`);
    }
    
    const minPercentage = parseFloat(internship.min_percentage?.replace('%', '')) || 0;
    const userPercentage = parseFloat(profile.cgpa) * 10;
    
    if (userPercentage >= minPercentage) {
        reasons.push(`Your academic performance meets the requirements`);
    }
    
    return reasons;
}

function renderMatchingResults(matches = appState.matchedInternships || []) {
    const container = document.getElementById('matchingResults');
    const matchCount = document.getElementById('matchCount');
    const avgMatch = document.getElementById('avgMatch');
    
    matchCount.textContent = matches.length;
    avgMatch.textContent = matches.length > 0 
        ? Math.round(matches.reduce((sum, match) => sum + match.matchScore, 0) / matches.length) + '%'
        : '0%';
    
    if (matches.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No matches found</h3>
                <p>Try updating your profile with more skills or different preferences to get better matches.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-score">${match.matchScore}% Match</div>
            <div class="internship-header">
                <h3 class="internship-title">${match.title}</h3>
                <div class="internship-org">${match.organization}</div>
            </div>
            <div class="internship-details">
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${match.department}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${match.duration}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Stipend:</span>
                    <span class="detail-value stipend-value">${match.stipend}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${match.location}</span>
                </div>
            </div>
            <div class="internship-description">
                ${match.description}
            </div>
            <div class="match-reasons">
                <h4>Why this is a good match:</h4>
                <ul>
                    ${match.matchReasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
            <div class="internship-actions">
                <button class="btn btn--secondary" onclick="toggleSaveInternship(${match.id})">
                    ${isInternshipSaved(match.id) ? 'Saved' : 'Save'}
                </button>
                <button class="btn btn--primary" onclick="applyToInternship(${match.id})">Apply Now</button>
                <a href="${match.apply_link}" target="_blank" class="btn btn--outline">Official Link</a>
            </div>
        </div>
    `).join('');
}

// Contact Form Handler
function handleContactSubmission(formData) {
    showToast('Submitting your message...', 'info');
    
    setTimeout(() => {
        const ticketId = 'TKT' + Math.floor(Math.random() * 100000);
        showToast(`Message sent successfully! Ticket ID: ${ticketId}`, 'success');
        
        document.getElementById('contactForm').reset();
    }, 2000);
}

function requestCallback() {
    const userPhone = prompt('Please enter your phone number for callback:');
    if (userPhone) {
        showToast('Callback request submitted! We will call you within 2 hours.', 'success');
    }
}

// Event Listeners Setup
document.addEventListener('DOMContentLoaded', function() {
    try {
    // Login form validation for email/phone
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = loginForm.querySelector('input[name="email"]').value.trim();
            if (!email) {
                e.preventDefault();
                showToast('Email is required for login.', 'error');
                return false;
            }
            // Optionally add phone check if phone field exists
        });
    }
    // Signup form validation for email/phone
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const email = signupForm.querySelector('input[name="email"]').value.trim();
            const phone = signupForm.querySelector('input[name="phone"]') ? signupForm.querySelector('input[name="phone"]').value.trim() : '';
            const password = signupForm.querySelector('input[name="password"]').value;
            const confirmPassword = signupForm.querySelector('input[name="confirmPassword"]').value;
            
            if (!email) {
                e.preventDefault();
                showToast('Email is required for signup.', 'error');
                return false;
            }
            if (signupForm.querySelector('input[name="phone"]') && !phone) {
                e.preventDefault();
                showToast('Phone number is required for signup.', 'error');
                return false;
            }
            if (password !== confirmPassword) {
                e.preventDefault();
                showToast('Passwords do not match.', 'error');
                return false;
            }
            if (password.length < 8) {
                e.preventDefault();
                showToast('Password must be at least 8 characters long.', 'error');
                return false;
            }
        });
        
        // Password strength indicator
        const passwordInput = document.getElementById('signupPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordStrength = document.getElementById('passwordStrength');
        const passwordMatch = document.getElementById('passwordMatch');
        
        if (passwordInput) {
            passwordInput.addEventListener('input', function(e) {
                const password = e.target.value;
                const strength = calculatePasswordStrength(password);
                
                passwordStrength.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
                
                if (password.length === 0) {
                    passwordStrength.classList.add('strength-weak');
                } else if (strength < 2) {
                    passwordStrength.classList.add('strength-weak');
                } else if (strength < 3) {
                    passwordStrength.classList.add('strength-fair');
                } else if (strength < 4) {
                    passwordStrength.classList.add('strength-good');
                } else {
                    passwordStrength.classList.add('strength-strong');
                }
                
                // Check match
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    checkPasswordMatch();
                }
            });
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        }
        
        function checkPasswordMatch() {
            if (passwordInput.value === confirmPasswordInput.value && passwordInput.value) {
                passwordMatch.textContent = '✓ Passwords match';
                passwordMatch.classList.add('match');
                passwordMatch.classList.remove('mismatch');
            } else if (confirmPasswordInput.value) {
                passwordMatch.textContent = '✗ Passwords do not match';
                passwordMatch.classList.add('mismatch');
                passwordMatch.classList.remove('match');
            } else {
                passwordMatch.textContent = '';
                passwordMatch.classList.remove('match', 'mismatch');
            }
        }
    }
    
    // Helper function to calculate password strength
    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    }
    // Profile picture upload/preview logic
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePicPreview = document.getElementById('profilePicPreview');
    if (profilePicInput && profilePicPreview) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    profilePicPreview.src = evt.target.result;
                    appState.userProfile.profilePicture = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    // Get new values
    const newName = document.getElementById('profileName').value.trim();
    const newEmail = document.getElementById('profileEmail').value.trim();
    const newUniv = document.getElementById('profileUniversity').value.trim();
    const newField = document.getElementById('profileFieldOfStudy').value.trim();
    const newPic = document.getElementById('profilePicPreview').src;

    appState.userProfile.fullName = newName;
    appState.userProfile.email = newEmail;
    appState.userProfile.university = newUniv;
    appState.userProfile.fieldOfStudy = newField;
    appState.userProfile.profilePicture = newPic;

    // Update dashboard
    document.getElementById('dashboardUserName').textContent = newName || 'User';
    document.getElementById('dashboardUserEmail').textContent = newEmail || '';
    // Update avatar in dashboard
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        let img = avatar.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            img.style.width = '56px';
            img.style.height = '56px';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            avatar.innerHTML = '';
            avatar.appendChild(img);
        }
        img.src = newPic;
    }
    // Update navbar profile name
    document.getElementById('userName').textContent = newName || 'User';
    // Optionally show toast
    showToast('Profile updated!', 'success');
    // Language selector event removed
    // Initialize app state
    appState.internships = applicationData.internships;
    appState.filteredInternships = applicationData.internships;
    appState.notifications = applicationData.latest_notifications;
    initSavedInternships();
    
    // Render initial content
    renderInternships();
    renderStudentReviews();
    renderNotifications();
    renderResourceGuides();
    renderGovernmentPartners();
    
    // Initialize form to step 1
    showFormStep(1);
    
    // Navigation event listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            const href = this.getAttribute('href');
            
            if (page) {
                showPage(page + 'Page');
            } else if (href) {
                if (href === '#home') {
                    showPage('landingPage');
                } else if (href === '#about') {
                    showPage('landingPage');
                    setTimeout(() => scrollToSection('about-section'), 100);
                } else if (href === '#internships') {
                    showPage('landingPage');
                    setTimeout(() => scrollToSection('internships-section'), 100);
                } else if (href === '#resources') {
                    showPage('landingPage');
                    setTimeout(() => scrollToSection('resources-section'), 100);
                }
            }
        });
    });
    
    // Authentication event listeners
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('signupBtn').addEventListener('click', () => {
        showLoginModal();
        switchAuthTab('signup');
    });
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    
    // Profile dropdown
    const profileMenuBtn = document.getElementById('profileMenuBtn');
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenuBtn && profileMenu) {
        profileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });
        
        document.getElementById('viewProfileBtn').addEventListener('click', () => {
            profileMenu.classList.add('hidden');
            showPage('dashboardPage');
            showDashboardSection('profile');
        });
        
        document.getElementById('dashboardBtn').addEventListener('click', () => {
            profileMenu.classList.add('hidden');
            showPage('dashboardPage');
            showDashboardSection('overview');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile-dropdown')) {
                profileMenu.classList.add('hidden');
            }
        });
    }
    
    document.getElementById('findInternshipBtn').addEventListener('click', () => {
        if (!appState.currentUser) {
            showLoginModal();
            showToast('Please login to find internships', 'info');
            return;
        }
        showPage('findInternshipPage');
    });
    
    document.getElementById('checkATSScoreBtn').addEventListener('click', () => {
        if (!appState.currentUser) {
            showLoginModal();
            showToast('Please login to check ATS score', 'info');
            return;
        }
        showPage('dashboardPage');
        showDashboardSection('ats-checker');
    });
    
    // Modal event listeners
    document.getElementById('closeModal').addEventListener('click', hideLoginModal);
    
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchAuthTab(e.target.dataset.tab));
    });
    
    document.getElementById('googleLogin').addEventListener('click', () => simulateGoogleAuth(false));
    document.getElementById('googleSignup').addEventListener('click', () => simulateGoogleAuth(true));
    
    // Notification controls
    document.getElementById('notificationFilter').addEventListener('change', filterNotifications);
    document.getElementById('refreshNotifications').addEventListener('click', refreshNotifications);
    document.getElementById('markAllRead').addEventListener('click', markAllNotificationsRead);
    
    // Resource guide filters
    document.querySelectorAll('.resource-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterResourceGuides(e.target.dataset.category);
        });
    });
    
    // Dashboard navigation
    document.querySelectorAll('.dash-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => showDashboardSection(e.target.dataset.section));
    });
    
    // Form step navigation
    document.getElementById('nextStep').addEventListener('click', () => {
        if (appState.currentFormStep < 5) {
            showFormStep(appState.currentFormStep + 1);
        }
    });
    
    document.getElementById('prevStep').addEventListener('click', () => {
        if (appState.currentFormStep > 1) {
            showFormStep(appState.currentFormStep - 1);
        }
    });
    
    document.getElementById('saveProgress').addEventListener('click', saveFormProgress);
    
    // Form submission
    document.getElementById('internshipForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleFormSubmission(formData);
    });
    
    // Skills input
    document.getElementById('skillInput').addEventListener('input', (e) => {
        showSkillSuggestions(e.target.value);
    });
    
    document.getElementById('skillInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const skill = e.target.value.trim();
            if (skill) {
                addSkill(skill);
            }
        }
    });
    
    // File uploads
    document.getElementById('resumeFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file, 'resume');
        }
    });
    
    document.getElementById('transcriptFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file, 'transcript');
        }
    });
    
    // File removal buttons
    document.getElementById('removeResumeFile').addEventListener('click', () => {
        document.getElementById('resumeUploadArea').style.display = 'block';
        document.getElementById('resumeUploadedFile').classList.add('hidden');
        document.getElementById('resumeFile').value = '';
        delete appState.userProfile.resume;
    });
    
    document.getElementById('removeTranscriptFile').addEventListener('click', () => {
        document.getElementById('transcriptUploadArea').style.display = 'block';
        document.getElementById('transcriptUploadedFile').classList.add('hidden');
        document.getElementById('transcriptFile').value = '';
        delete appState.userProfile.transcript;
    });
    
    // ATS file upload
    document.getElementById('atsResumeFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleATSUpload(file);
        }
    });
    
    // Chatbot event listeners
    document.getElementById('chatbotToggle').addEventListener('click', openChatbot);
    document.getElementById('closeChatbot').addEventListener('click', closeChatbot);
    document.getElementById('minimizeChatbot').addEventListener('click', minimizeChatbot);
    document.getElementById('sendChatMessage').addEventListener('click', sendChatMessage);
    
    document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactSubmission(new FormData(e.target));
    });
    
    // Search and filter event listeners
    document.getElementById('searchInternships').addEventListener('input', filterInternships);
    document.getElementById('filterDepartment').addEventListener('change', filterInternships);
    document.getElementById('filterLocation').addEventListener('change', filterInternships);

    // Navbar mobile toggle
    const navToggle = document.getElementById('navbarToggle');
    const navMenu = document.getElementById('navbarMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        // Close menu on link click (mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Results page navigation
    document.getElementById('backToForm').addEventListener('click', () => showPage('findInternshipPage'));
    document.getElementById('backToHome').addEventListener('click', () => showPage('landingPage'));
    
    // Close modal on outside click
    const loginModalElem = document.getElementById('loginModal');
    if (loginModalElem) {
        loginModalElem.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                hideLoginModal();
            }
        });
    }
    } catch (e) {
        console.error('Initialization error:', e);
    }
});

// Global functions for onclick handlers
window.applyToInternship = applyToInternship;
window.showPage = showPage;
window.showDashboardSection = showDashboardSection;
window.updateProfile = updateProfile;
window.requestCallback = requestCallback;
window.openChatbot = openChatbot;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.openNotification = openNotification;
window.viewNotificationDetails = viewNotificationDetails;
window.startResource = startResource;
window.downloadResource = downloadResource;
window.toggleSaveInternship = toggleSaveInternship;

console.log('Enhanced Neogen Government Internship Portal loaded successfully!');