// Utility functions

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') return decodeURIComponent(value);
    }
    return null;
}

function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function renderCompanyLogo(job) {
    // 1. First try: Company logo from the job itself
    if (job.company_logo) {
        return `<img src="${job.company_logo}" class="company-logo-small" alt="${escapeHtml(job.company_name || 'Company')}">`;
    }
    
    // 2. Second try: Author's business profile picture
    if (job.author && job.author.profile_picture) {
        return `<img src="${job.author.profile_picture}" class="company-logo-small" alt="${escapeHtml(job.author.username || 'Author')}">`;
    }
    
    // 3. Fallback: Default placeholder
    return `<div class="company-logo-placeholder">
                <i class="fas fa-building"></i>
            </div>`;
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="loading-spinner"></span>';
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText || '';
        button.disabled = false;
    }
}