// Job-related functions

function loadJobs() {
    const container = document.getElementById('jobsContainer');
    container.innerHTML = '';
    
    fetch(CONFIG.API_ENDPOINTS.JOBS)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.jobs && data.jobs.length > 0) {
                appState.allJobs = data.jobs;
                renderJobs(data.jobs);
                renderTrendingJobs(data.jobs.slice(0, 3));
                updateStats();
            } else {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                        <p>No jobs available at the moment</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading jobs:', error);
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <p>Error loading jobs. Please try again.</p>
                </div>
            `;
        });
}

function renderJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    container.innerHTML = jobs.map(job => createJobCardHTML(job)).join('');
}

function createJobCardHTML(job) {
    const statusBadge = createJobStatusBadge(job);
    const applyButton = createApplyButton(job);
    
    return `
        <div class="job-card">
            <div class="job-card-header">
                <!-- Plus icon for post creation -->
                <div class="add-post-icon-container">
                    <button class="add-post-icon" onclick="showPostModal()" title="Create post">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <!-- Message icon -->
                <div class="message-icon-container">
                    <a href="/messaging/" class="message-icon" title="Message employer">
                        <i class="fas fa-comment-dots"></i>
                    </a>
                </div>
                
                ${statusBadge}
                <div class="company-logo-container">
                    ${renderCompanyLogo(job)}
                    <div class="company-info">
                        <h5 class="job-title">${escapeHtml(job.title)}</h5>
                        <h6 class="company-name">${escapeHtml(job.company_name)}</h6>
                    </div>
                </div>
                <div class="job-meta">
                    <div class="job-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${escapeHtml(job.location)}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${job.employment_type || 'Full-time'}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${job.salary || 'Competitive'}</span>
                    </div>
                </div>
            </div>
            <div class="job-card-body">
                <p class="job-description">${job.position_summary ? escapeHtml(job.position_summary.substring(0, 150) + '...') : 'No description available'}</p>
                <div class="job-meta">
                    <div class="job-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>Apply by: ${new Date(job.apply_by).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div class="job-card-footer">
                <div class="card-footer-content">
                    <div class="job-actions">
                        <button class="btn btn-view" onclick="viewJob('${job.id}')">
                            <i class="fas fa-eye me-1"></i> View Details
                        </button>
                        ${applyButton}
                    </div>
                    <!-- Share Button -->
                    ${createShareButton(job.id)}
                </div>
            </div>
        </div>
    `;
}

function createJobStatusBadge(job) {
    let statusClass = CONFIG.JOB_STATUS.PUBLISHED;
    let statusText = 'Active';
    
    const applyBy = new Date(job.apply_by);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((applyBy - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 3 && daysUntilDeadline >= 0) {
        statusClass = CONFIG.JOB_STATUS.URGENT;
        statusText = 'Urgent';
    } else if (daysUntilDeadline < 0) {
        statusClass = CONFIG.JOB_STATUS.URGENT;
        statusText = 'Expired';
    }
    
    if (job.is_featured) {
        statusClass = CONFIG.JOB_STATUS.FEATURED;
        statusText = 'Featured';
    }
    
    return `<span class="job-status-badge ${statusClass}">${statusText}</span>`;
}

function createApplyButton(job) {
    const hasApplied = job.user_has_applied || false;
    
    if (hasApplied) {
        return `<button class="btn btn-applied" disabled>
                    <i class="fas fa-check"></i> Applied
                </button>`;
    }
    
    if (appState.user && appState.user.is_authenticated) {
        return `<button class="btn btn-apply" onclick="applyForJob('${job.id}', this)">
                    <i class="fas fa-paper-plane me-1"></i> Apply
                </button>`;
    }
    
    return `<button class="btn btn-apply" onclick="showLogin()">
                <i class="fas fa-sign-in-alt me-1"></i> Login to Apply
            </button>`;
}

function createShareButton(jobId) {
    return `
        <div class="share-button-container">
            <button class="share-button" onclick="toggleShareDropdown(this)">
                <i class="fas fa-share-alt me-1"></i> Share
            </button>
            <div class="share-dropdown">
                <a href="#" onclick="shareToFacebook('${jobId}'); return false;">
                    <i class="fab fa-facebook-f"></i> Facebook
                </a>
                <a href="#" onclick="shareToLinkedIn('${jobId}'); return false;">
                    <i class="fab fa-linkedin-in"></i> LinkedIn
                </a>
                <a href="#" onclick="shareToWhatsApp('${jobId}'); return false;">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a href="#" onclick="shareToTwitter('${jobId}'); return false;">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="#" onclick="shareViaEmail('${jobId}'); return false;">
                    <i class="fas fa-envelope"></i> Email
                </a>
                <a href="#" onclick="copyLink('${jobId}'); return false;">
                    <i class="fas fa-link"></i> Copy Link
                </a>
            </div>
        </div>
    `;
}

function viewJob(jobId) {
    window.location.href = `/jobs/${jobId}/`;
}

function applyForJob(jobId, button) {
    setLoading(button, true);
    
    fetch(CONFIG.API_ENDPOINTS.JOB_APPLY.replace('{id}', jobId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            button.innerHTML = '<i class="fas fa-check"></i> Applied';
            button.classList.remove('btn-apply');
            button.classList.add('btn-applied');
            button.disabled = true;
            showToast('Application submitted successfully!', 'success');
        } else {
            setLoading(button, false);
            showToast(data.error || 'Failed to apply', 'error');
        }
    })
    .catch(error => {
        setLoading(button, false);
        showToast('Error submitting application', 'error');
    });
}

function renderTrendingJobs(jobs) {
    const container = document.getElementById('trendingJobs');
    if (!container) return;
    
    container.innerHTML = jobs.map(job => `
        <div class="mb-3 p-2 border rounded">
            <div class="d-flex align-items-center mb-2">
                ${renderCompanyLogo(job)}
                <div>
                    <strong>${escapeHtml(job.title)}</strong>
                    <div class="small text-muted">${escapeHtml(job.company_name)}</div>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-primary mt-2 w-100" onclick="viewJob('${job.id}')">
                View Job
            </button>
        </div>
    `).join('');
}