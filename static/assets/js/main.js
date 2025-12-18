// Main initialization file

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data in appState
    appState.user = window.userData || {
        is_authenticated: false,
        user_type: null
    };
    
    // Set up event listeners for Enter key in comment inputs
    document.addEventListener('keypress', function(event) {
        if (event.target.classList.contains('comment-input') && event.key === 'Enter') {
            const postId = event.target.id.split('-')[2];
            addComment(postId);
        }
    });
    
    // Close post modal when clicking outside
    document.getElementById('postModal').addEventListener('click', function(event) {
        if (event.target === this) {
            hidePostModal();
        }
    });
    
    // Setup auth forms
    setupLoginForm();
    setupSignupForm();
    setupBusinessSignupForm();
    
    // Mobile bottom nav active state
    document.querySelectorAll('.mobile-bottom-nav a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.mobile-bottom-nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load initial content
    switchTab('jobs');
    
    // Load business stats for admin users
    if (appState.user && appState.user.is_authenticated && appState.user.user_type === 'admin') {
        loadBusinessStats();
        
        // Auto-refresh business stats every 30 seconds
        setInterval(loadBusinessStats, 30000);
    }
});