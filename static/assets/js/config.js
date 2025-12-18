// Global configuration and constants
const CONFIG = {
    API_ENDPOINTS: {
        JOBS: '/api/jobs/',
        POSTS: '/api/posts/',
        POSTS_FEED: '/api/posts/feed/',
        POST_LIKE: '/api/posts/{id}/like-dislike/',
        POST_COMMENTS: '/api/post-comments/{id}/',
        AUTH_LOGIN: '/api/auth/login/',
        AUTH_SIGNUP: '/api/auth/signup/',
        BUSINESS_SIGNUP: '/api/business-signup/',
        BUSINESS_STATS: '/api/business-stats/',
        INDUSTRIES: '/api/industries/',
        COMPANY_SIZES: '/api/company-sizes/',
        JOB_APPLY: '/api/jobs/{id}/apply/'
    },
    
    JOB_STATUS: {
        PUBLISHED: 'status-published',
        URGENT: 'status-urgent',
        FEATURED: 'status-featured'
    },
    
    COLORS: {
        PRIMARY: '#0073b1',
        SECONDARY: '#ff589e',
        DARK: '#191919',
        LIGHT: '#f8f9fa',
        GRAY: '#8e8e8e'
    }
};

// Global state
let appState = {
    currentTab: 'jobs',
    allPosts: [],
    allJobs: [],
    activeDropdown: null,
    user: window.userData || null
};