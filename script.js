// Portfolio Script - Unified Version
let allProjects = [];
let currentFilter = 'all';
let expandedProject = null;
let selectedProjectIndex = -1;
let konamiCode = [];
let showPrivate = false;

// Konami code sequence
const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    setupEventListeners();
    handleUrlHash();
});

// Load projects
async function loadProjects() {
    try {
        const response = await fetch('data/build/projects.json');
        const data = await response.json();
        
        // Combine featured and regular projects
        allProjects = [...(data.featured || []), ...(data.projects || [])];
        
        renderProjects();
        updateFilterCounts();
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

// Render all projects
function renderProjects() {
    const container = document.getElementById('projects-container');
    let projectsToShow = [...allProjects];
    
    // Add private projects if Easter egg is active
    if (showPrivate) {
        projectsToShow = [...projectsToShow, ...getPrivateProjects()];
    }
    
    const filteredProjects = filterProjects(projectsToShow);
    
    container.innerHTML = filteredProjects.map((project, index) => 
        createProjectHTML(project, index + 1)
    ).join('');
}

// Create project HTML
function createProjectHTML(project, index) {
    const indexStr = String(index).padStart(3, '0');
    const techStr = project.tech.join(' × ');
    const githubLink = project.github_url 
        ? `<a href="${project.github_url}" target="_blank" rel="noopener">${project.title}</a>`
        : project.title;
    
    return `
        <div class="project ${project.expanded_content ? 'featured' : ''}" data-category="${project.category}" data-project-id="${project.id}">
            <div class="project-index">${indexStr}</div>
            <h2 class="project-title">${githubLink}</h2>
            <div class="project-category">${project.category}</div>
            <div class="project-year">${project.year}</div>
            ${project.highlight ? `<div class="project-highlight">${project.highlight}</div>` : ''}
            <p class="project-description">
                ${project.full_description && project.summary.endsWith('...') ? 
                    `<span class="desc-truncated">${project.summary.slice(0, -3)}</span><span class="desc-ellipsis">...</span><span class="desc-continuation">${project.full_description.toLowerCase().substring(project.summary.length - 3)}</span>` : 
                    project.summary}
            </p>
            <div class="project-tech">${techStr}</div>
            
            ${project.expanded_content ? `
                <div class="project-expanded">
                    <div class="case-study-section">
                        <h3>problem</h3>
                        <p>${project.expanded_content.problem}</p>
                    </div>
                    <div class="case-study-section">
                        <h3>approach</h3>
                        <p>${project.expanded_content.approach}</p>
                    </div>
                    <div class="case-study-section">
                        <h3>results</h3>
                        <p>${project.expanded_content.results}</p>
                    </div>
                    <div class="case-study-section">
                        <h3>impact</h3>
                        <p>${project.expanded_content.impact}</p>
                    </div>
                </div>
                <button class="expand-btn" aria-label="Expand project details">
                    <span class="expand-icon">+</span>
                </button>
            ` : ''}
        </div>
    `;
}

// Filter projects
function filterProjects(projects) {
    if (currentFilter === 'all') return projects;
    return projects.filter(p => p.category === currentFilter);
}

// Update filter counts
function updateFilterCounts() {
    const categories = {
        'all': allProjects.length,
        'ai-ml': 0,
        'analytics': 0,
        'engineering': 0,
        'web': 0,
        'tools': 0,
        'research': 0
    };
    
    allProjects.forEach(project => {
        if (categories.hasOwnProperty(project.category)) {
            categories[project.category]++;
        }
    });
    
    // Update button text with counts
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filter = btn.dataset.filter;
        const count = categories[filter] || 0;
        if (count > 0 || filter === 'all') {
            btn.innerHTML = `${filter} (${count})`;
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none'; // Hide filters with no projects
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Expand buttons (delegated)
    document.addEventListener('click', handleExpandClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Hash change
    window.addEventListener('hashchange', handleUrlHash);
    
    // Mouse coordinates
    document.addEventListener('mousemove', updateCoordinates);
    
    // Page indicator on scroll
    window.addEventListener('scroll', updatePageIndicator);
    
    // Contact link
    const contactLink = document.querySelector('a[href="#contact"]');
    if (contactLink) {
        contactLink.addEventListener('click', handleContactClick);
    }
    
    // Mobile work section visibility
    if (window.innerWidth <= 768) {
        setupMobileWorkSection();
    }
}

// Setup mobile work section behavior
function setupMobileWorkSection() {
    const workSection = document.querySelector('.work-section');
    const workLink = document.querySelector('a[href="#work"]');
    
    // Show work section when clicking work link
    if (workLink) {
        workLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (workSection) {
                workSection.style.display = 'block';
                workSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Show work section on scroll past header
    let headerHeight = document.querySelector('.header').offsetHeight;
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            if (window.scrollY > headerHeight * 0.8) {
                workSection.style.display = 'block';
            }
        }
    });
}

// Handle filter click
function handleFilterClick(e) {
    e.preventDefault(); // Prevent default anchor behavior
    const btn = e.currentTarget;
    const filter = btn.dataset.filter;
    
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update filter and URL without scrolling
    currentFilter = filter;
    if (filter === 'all') {
        // Remove hash without causing scroll
        history.pushState('', document.title, window.location.pathname + window.location.search);
    } else {
        // Update hash without scrolling
        history.pushState('', document.title, '#' + filter);
    }
    
    // Re-render projects
    renderProjects();
}

// Handle expand click
function handleExpandClick(e) {
    const expandBtn = e.target.closest('.expand-btn');
    if (!expandBtn) return;
    
    const projectEl = expandBtn.closest('.project');
    const projectId = projectEl.dataset.projectId;
    
    // Close previously expanded project
    if (expandedProject && expandedProject !== projectId) {
        const prevEl = document.querySelector(`[data-project-id="${expandedProject}"]`);
        if (prevEl) prevEl.classList.remove('expanded');
    }
    
    // Toggle current project
    projectEl.classList.toggle('expanded');
    expandedProject = projectEl.classList.contains('expanded') ? projectId : null;
}

// Handle keyboard shortcuts
function handleKeyPress(e) {
    // Konami code check
    konamiCode.push(e.key);
    if (konamiCode.length > KONAMI_SEQUENCE.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(KONAMI_SEQUENCE)) {
        activateEasterEgg();
        return;
    }
    
    // Regular keyboard shortcuts
    switch(e.key) {
        case 'j': // Next project
            navigateProjects(1);
            break;
        case 'k': // Previous project
            navigateProjects(-1);
            break;
        case 'Escape': // Close expanded project
            closeExpanded();
            break;
        case '/': // Search (if you want to implement)
            if (e.target.tagName !== 'INPUT') {
                e.preventDefault();
                // Could implement search here
            }
            break;
    }
}

// Navigate projects with j/k
function navigateProjects(direction) {
    const projectEls = document.querySelectorAll('.project');
    if (projectEls.length === 0) return;
    
    selectedProjectIndex += direction;
    if (selectedProjectIndex < 0) selectedProjectIndex = projectEls.length - 1;
    if (selectedProjectIndex >= projectEls.length) selectedProjectIndex = 0;
    
    projectEls.forEach(el => el.classList.remove('selected'));
    const selectedEl = projectEls[selectedProjectIndex];
    selectedEl.classList.add('selected');
    selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Close expanded project
function closeExpanded() {
    const expandedEl = document.querySelector('.project.expanded');
    if (expandedEl) {
        expandedEl.classList.remove('expanded');
        expandedProject = null;
    }
}

// Handle URL hash for filters
function handleUrlHash() {
    const hash = window.location.hash.slice(1);
    if (hash && document.querySelector(`[data-filter="${hash}"]`)) {
        currentFilter = hash;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-filter="${hash}"]`).classList.add('active');
        renderProjects();
    }
}

// Update mouse coordinates display
function updateCoordinates(e) {
    const x = Math.round((e.clientX / window.innerWidth) * 180 - 90);
    const y = Math.round((e.clientY / window.innerHeight) * 90 - 45);
    const coordsEl = document.getElementById('coords');
    if (coordsEl) {
        coordsEl.textContent = `${Math.abs(y)}°${y >= 0 ? 'N' : 'S'} ${Math.abs(x)}°${x >= 0 ? 'E' : 'W'}`;
    }
}

// Update page indicator based on scroll position
function updatePageIndicator() {
    const sections = [
        document.querySelector('.header'),
        document.querySelector('.work-section'),
        document.querySelector('.about'),
        document.querySelector('.skills')
    ];
    
    const dots = document.querySelectorAll('.page-dot');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    let activeSection = 0;
    
    sections.forEach((section, index) => {
        if (section) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = index;
            }
        }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === activeSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Handle contact click
function handleContactClick(e) {
    e.preventDefault();
    const email = 'glenn.r.harless@gmail.com';
    
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        showNotification('Email: ' + email);
    });
}

// Show notification
function showNotification(message) {
    // Remove any existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('visible'), 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Easter egg activation
function activateEasterEgg() {
    showPrivate = !showPrivate;
    konamiCode = []; // Reset
    showNotification(showPrivate ? '🔓 Private repos unlocked!' : '🔒 Private repos hidden');
    renderProjects(); // Re-render with private projects
}

// Get mock private projects
function getPrivateProjects() {
    return [
        {
            id: 'secret-project',
            title: 'classified ml research',
            category: 'research',
            year: '2025',
            summary: 'redacted - clearance level 5 required',
            tech: ['classified', 'top-secret', 'quantum'],
            is_private: true
        }
    ];
}