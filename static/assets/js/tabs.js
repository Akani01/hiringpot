// Tab management functions

function switchTab(tabName) {
    appState.currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mobile-bottom-nav a').forEach(btn => btn.classList.remove('active'));
    
    document.querySelectorAll(`[onclick*="${tabName}"]`).forEach(btn => btn.classList.add('active'));
    
    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Show/hide create post card
    const createPostCard = document.getElementById('createPostCard');
    if (createPostCard) {
        if (tabName === 'feed' || tabName === 'myPosts') {
            createPostCard.classList.remove('hidden');
        } else {
            createPostCard.classList.add('hidden');
        }
    }
    
    // Load appropriate content
    switch(tabName) {
        case 'jobs':
            loadJobs();
            break;
        case 'feed':
            loadFeedPosts();
            break;
        case 'myPosts':
            loadMyPosts();
            break;
    }
}

function toggleFeed() {
    if (appState.currentTab === 'feed') {
        switchTab('jobs');
        document.querySelector('.feed-toggle-btn').innerHTML = '<i class="fas fa-newspaper"></i> Feed';
    } else {
        switchTab('feed');
        document.querySelector('.feed-toggle-btn').innerHTML = '<i class="fas fa-briefcase"></i> Jobs';
    }
}