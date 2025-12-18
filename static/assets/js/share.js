// Share functionality

function shareToFacebook(jobId) {
    const url = encodeURIComponent(`${window.location.origin}/jobs/${jobId}/`);
    const title = encodeURIComponent(`Check out this job opportunity!`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
}

function shareToLinkedIn(jobId) {
    const url = encodeURIComponent(`${window.location.origin}/jobs/${jobId}/`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
}

function shareToWhatsApp(jobId) {
    const url = `${window.location.origin}/jobs/${jobId}/`;
    const text = `Check out this job opportunity! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
}

function shareToTwitter(jobId) {
    const url = encodeURIComponent(`${window.location.origin}/jobs/${jobId}/`);
    const text = encodeURIComponent(`Check out this job opportunity!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
}

function shareViaEmail(jobId) {
    const url = `${window.location.origin}/jobs/${jobId}/`;
    const subject = encodeURIComponent(`Job Opportunity`);
    const body = encodeURIComponent(`I found this job opportunity and thought you might be interested:\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function copyLink(jobId) {
    const url = `${window.location.origin}/jobs/${jobId}/`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!', 'success');
            closeAllDropdowns();
        }).catch(() => {
            fallbackCopyText(url);
        });
    } else {
        fallbackCopyText(url);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
    document.body.removeChild(textArea);
}