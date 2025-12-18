// Stats and business functions

function updateStats() {
    // Update jobs count
    const jobsCount = document.getElementById('jobsCount');
    if (jobsCount) {
        jobsCount.textContent = appState.allJobs.length;
    }
    
    // Update posts count
    const postsCount = document.getElementById('postsCount');
    if (postsCount) {
        postsCount.textContent = appState.allPosts.length;
    }
}

function loadBusinessStats() {
    if (!appState.user || !appState.user.is_authenticated || !appState.user.user_type === 'admin') {
        return;
    }
    
    fetch(CONFIG.API_ENDPOINTS.BUSINESS_STATS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('activeJobsCount').textContent = data.stats.active_jobs || '0';
            document.getElementById('totalApplications').textContent = data.stats.total_applications || '0';
            document.getElementById('profileViews').textContent = data.stats.profile_views || '0';
        } else {
            console.error('Failed to load business stats:', data.error);
            document.getElementById('activeJobsCount').textContent = '0';
            document.getElementById('totalApplications').textContent = '0';
            document.getElementById('profileViews').textContent = '0';
        }
    })
    .catch(error => {
        console.error('Error loading business stats:', error);
        document.getElementById('activeJobsCount').textContent = '0';
        document.getElementById('totalApplications').textContent = '0';
        document.getElementById('profileViews').textContent = '0';
    });
}