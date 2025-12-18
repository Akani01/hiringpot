// Authentication functions

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showSignup() {
    const modal = new bootstrap.Modal(document.getElementById('signupModal'));
    modal.show();
}

function showBusinessSignup() {
    loadBusinessFormData();
    const modal = new bootstrap.Modal(document.getElementById('businessSignupModal'));
    modal.show();
}

function loadBusinessFormData() {
    // Load industries
    fetch(CONFIG.API_ENDPOINTS.INDUSTRIES)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('industrySelect');
                select.innerHTML = '<option value="">Select Industry</option>';
                data.industries.forEach(industry => {
                    const option = document.createElement('option');
                    option.value = industry.id;
                    option.textContent = industry.name;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading industries:', error);
        });

    // Load company sizes
    fetch(CONFIG.API_ENDPOINTS.COMPANY_SIZES)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('companySizeSelect');
                select.innerHTML = '<option value="">Select Company Size</option>';
                data.company_sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size.id;
                    option.textContent = size.size_range;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading company sizes:', error);
        });
}

// Login form handler
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        const submitBtn = this.querySelector('button[type="submit"]');
        
        setLoading(submitBtn, true);

        fetch(CONFIG.API_ENDPOINTS.AUTH_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    const bsModal = bootstrap.Modal.getInstance(loginModal);
                    if (bsModal) bsModal.hide();
                }
                
                showToast('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    if (data.redirect_to === 'admin_portal') {
                        window.location.href = '/admin-portal/';
                    } else if (data.redirect_to === 'applicant_dashboard') {
                        window.location.href = '/dashboard/';
                    } else {
                        location.reload();
                    }
                }, 1500);
            } else {
                setLoading(submitBtn, false);
                showToast('Login failed: ' + (data.error || 'Please check your credentials'), 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(submitBtn, false);
            showToast('Login failed. Please try again.', 'error');
        });
    });
}

// Job seeker signup form handler
function setupSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        document.getElementById('usernameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('confirmPasswordError').textContent = '';
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        const submitBtn = this.querySelector('button[type="submit"]');

        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            return;
        }

        setLoading(submitBtn, true);

        fetch(CONFIG.API_ENDPOINTS.AUTH_SIGNUP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const signupModal = document.getElementById('signupModal');
                if (signupModal) {
                    const bsModal = bootstrap.Modal.getInstance(signupModal);
                    if (bsModal) bsModal.hide();
                }
                
                showToast('Account created successfully! Please login.', 'success');
                
                setTimeout(() => {
                    showLogin();
                }, 2000);
            } else {
                setLoading(submitBtn, false);
                
                if (data.errors) {
                    if (data.errors.username) {
                        document.getElementById('usernameError').textContent = data.errors.username[0];
                    }
                    if (data.errors.email) {
                        document.getElementById('emailError').textContent = data.errors.email[0];
                    }
                    if (data.errors.password) {
                        document.getElementById('passwordError').textContent = data.errors.password[0];
                    }
                } else {
                    showToast('Signup failed: ' + (data.error || 'Please try again'), 'error');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(submitBtn, false);
            showToast('Signup failed. Please try again.', 'error');
        });
    });
}

// Business signup form handler
function setupBusinessSignupForm() {
    const form = document.getElementById('businessSignupForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');

        const password = document.getElementById('businessPassword').value;
        const confirmPassword = document.getElementById('businessConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        setLoading(submitBtn, true);

        fetch(CONFIG.API_ENDPOINTS.BUSINESS_SIGNUP, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const businessModal = document.getElementById('businessSignupModal');
                if (businessModal) {
                    const bsModal = bootstrap.Modal.getInstance(businessModal);
                    if (bsModal) bsModal.hide();
                }
                
                showToast('Business account created successfully! Please login.', 'success');
                
                setTimeout(() => {
                    showLogin();
                }, 2000);
            } else {
                setLoading(submitBtn, false);
                showToast('Business signup failed: ' + (data.error || 'Please try again'), 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setLoading(submitBtn, false);
            showToast('Business signup failed. Please try again.', 'error');
        });
    });
}