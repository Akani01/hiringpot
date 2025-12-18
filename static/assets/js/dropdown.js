// Dropdown management functions

function toggleProfileMenu() {
    closeAllDropdowns();
    const dropdown = document.getElementById('profileMenu');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        appState.activeDropdown = dropdown;
        document.body.classList.add('dropdown-open');
    } else {
        appState.activeDropdown = null;
        document.body.classList.remove('dropdown-open');
    }
}

function toggleThreeDotMenu(button) {
    closeAllDropdowns();
    const dropdown = button.parentElement.querySelector('.menu-content');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        appState.activeDropdown = dropdown;
        document.body.classList.add('dropdown-open');
    } else {
        appState.activeDropdown = null;
        document.body.classList.remove('dropdown-open');
    }
}

function toggleShareDropdown(button) {
    closeAllDropdowns();
    const dropdown = button.nextElementSibling;
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        appState.activeDropdown = dropdown;
        document.body.classList.add('dropdown-open');
    } else {
        appState.activeDropdown = null;
        document.body.classList.remove('dropdown-open');
    }
}

function closeAllDropdowns() {
    // Close profile menu
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) profileMenu.classList.remove('show');
    
    // Close all three-dot menus
    document.querySelectorAll('.three-dot-menu .menu-content').forEach(menu => {
        menu.classList.remove('show');
    });
    
    // Close all share dropdowns
    document.querySelectorAll('.share-dropdown').forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    appState.activeDropdown = null;
    document.body.classList.remove('dropdown-open');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.profile-dropdown') && 
        !event.target.closest('.three-dot-menu') &&
        !event.target.closest('.share-button-container')) {
        closeAllDropdowns();
    }
});

// Close dropdowns when clicking escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAllDropdowns();
    }
});