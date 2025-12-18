// Post-related functions

function loadFeedPosts() {
    const container = document.getElementById('feedContainer');
    container.innerHTML = '';
    
    fetch(CONFIG.API_ENDPOINTS.POSTS_FEED)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.posts) {
                appState.allPosts = data.posts;
                renderPosts(data.posts, 'feedContainer');
                updateStats();
            } else {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                        <p>No posts to show yet</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading feed posts:', error);
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <p>Error loading posts. Please try again.</p>
                </div>
            `;
        });
}

function loadMyPosts() {
    const container = document.getElementById('myPostsContainer');
    container.innerHTML = '';
    
    fetch(CONFIG.API_ENDPOINTS.POSTS + '?show_all=false')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.posts) {
                renderPosts(data.posts, 'myPostsContainer');
            } else {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-user fa-3x text-muted mb-3"></i>
                        <p>You haven't created any posts yet</p>
                        <button class="btn btn-primary mt-3" onclick="showPostModal()">
                            <i class="fas fa-plus me-2"></i>Create Your First Post
                        </button>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading my posts:', error);
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <p>Error loading your posts. Please try again.</p>
                </div>
            `;
        });
}

function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    
    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <p>No posts to show</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => createPostCardHTML(post)).join('');
}

function createPostCardHTML(post) {
    return `
        <div class="post-card" id="post-${post.id}">
            <div class="post-header">
                <div class="user-avatar">
                    ${post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div class="post-user-info">
                    <span class="post-username">${escapeHtml(post.author?.username || 'Unknown')}</span>
                    <span class="post-time">
                        ${post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                </div>
            </div>
            
            <div class="post-content">
                <p class="post-text">${escapeHtml(post.content || '')}</p>
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
            </div>
            
            <div class="post-stats">
                <span>${post.likes_count || 0} likes</span>
                <span>${post.comments_count || 0} comments</span>
            </div>
            
            <div class="post-actions-bar">
                <button class="post-action ${post.user_has_liked ? 'liked' : ''}" onclick="likePost(${post.id}, this)">
                    <i class="fas fa-heart"></i> Like
                </button>
                <button class="post-action" onclick="toggleComments(${post.id})">
                    <i class="fas fa-comment"></i> Comment
                </button>
            </div>
            
            <div id="comments-${post.id}" class="comments-section">
                <div class="comment-input-row">
                    <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="Write a comment...">
                    <button class="comment-btn" onclick="addComment(${post.id})">Post</button>
                </div>
                <div id="comments-list-${post.id}" class="comments-list">
                    <!-- Comments will be loaded here -->
                </div>
            </div>
        </div>
    `;
}

function showPostModal() {
    if (appState.user && appState.user.is_authenticated) {
        document.getElementById('postModal').classList.add('show');
        document.getElementById('postTextarea').focus();
    } else {
        showLogin();
    }
}

function hidePostModal() {
    document.getElementById('postModal').classList.remove('show');
    document.getElementById('postTextarea').value = '';
    document.getElementById('mediaPreview').style.display = 'none';
    document.getElementById('previewImage').src = '';
}

function previewMedia(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('mediaPreview');
        const img = document.getElementById('previewImage');
        img.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function createPost() {
    const content = document.getElementById('postTextarea').value.trim();
    const mediaInput = document.getElementById('mediaInput');
    
    if (!content && !mediaInput.files[0]) {
        showToast('Please add some text or media', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('content', content);
    
    if (mediaInput.files[0]) {
        formData.append('image', mediaInput.files[0]);
    }
    
    const btn = document.getElementById('createPostBtn');
    setLoading(btn, true);
    
    fetch(CONFIG.API_ENDPOINTS.POSTS, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        setLoading(btn, false);
        
        if (data.success) {
            showToast('Post created successfully!', 'success');
            hidePostModal();
            
            // Reload posts based on current tab
            if (appState.currentTab === 'feed') {
                loadFeedPosts();
            } else if (appState.currentTab === 'myPosts') {
                loadMyPosts();
            }
        } else {
            showToast(data.error || 'Failed to create post', 'error');
        }
    })
    .catch(error => {
        setLoading(btn, false);
        showToast('Error creating post', 'error');
        console.error('Error:', error);
    });
}

function likePost(postId, button) {
    fetch(CONFIG.API_ENDPOINTS.POST_LIKE.replace('{id}', postId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ action: 'like' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.user_has_liked) {
                button.classList.add('liked');
            } else {
                button.classList.remove('liked');
            }
            
            // Update likes count
            const postCard = document.getElementById(`post-${postId}`);
            if (postCard) {
                const stats = postCard.querySelector('.post-stats');
                if (stats) {
                    const likesSpan = stats.querySelector('span');
                    if (likesSpan) {
                        likesSpan.textContent = `${data.likes_count} likes`;
                    }
                }
            }
        }
    })
    .catch(error => {
        console.error('Error liking post:', error);
        showToast('Failed to like post', 'error');
    });
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.classList.toggle('show');
        
        if (commentsSection.classList.contains('show')) {
            loadComments(postId);
        }
    }
}

function loadComments(postId) {
    const commentsList = document.getElementById(`comments-list-${postId}`);
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    fetch(CONFIG.API_ENDPOINTS.POST_COMMENTS.replace('{id}', postId))
        .then(response => response.json())
        .then(data => {
            if (data.success && data.comments) {
                commentsList.innerHTML = data.comments.map(comment => `
                    <div class="comment-item">
                        <div class="comment-author">
                            ${escapeHtml(comment.author?.username || 'User')}
                        </div>
                        <div class="comment-text">
                            ${escapeHtml(comment.content)}
                        </div>
                    </div>
                `).join('');
            } else {
                commentsList.innerHTML = '<p class="text-muted text-center">No comments yet</p>';
            }
        })
        .catch(error => {
            console.error('Error loading comments:', error);
            commentsList.innerHTML = `
                <p class="text-muted text-center">
                    <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                    Error loading comments
                </p>
            `;
        });
}

function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input) return;
    
    const content = input.value.trim();
    if (!content) return;
    
    fetch(CONFIG.API_ENDPOINTS.POST_COMMENTS.replace('{id}', postId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ content: content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            input.value = '';
            loadComments(postId);
            showToast('Comment added!', 'success');
        } else {
            showToast('Failed to add comment', 'error');
        }
    })
    .catch(error => {
        console.error('Error adding comment:', error);
        showToast('Error adding comment', 'error');
    });
}