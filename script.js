// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const navbar = document.querySelector('.navbar');
const particles = document.getElementById('particles');
const contactForm = document.getElementById('contactForm');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillBars = document.querySelectorAll('.skill-bar');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
const icon = themeToggle.querySelector('i');
icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Particle animation
function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particles.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Project filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                }, 100);
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Animate skill bars on scroll
function animateSkillBars() {
    const skillsSection = document.getElementById('skills');
    const rect = skillsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        });
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .timeline-item, .skill-category, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact form handling with Formspree (easier setup)
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Prepare data for Formspree
    const formDataToSend = new FormData();
    formDataToSend.append('name', data.name);
    formDataToSend.append('email', data.email);
    formDataToSend.append('subject', data.subject);
    formDataToSend.append('message', data.message);
    formDataToSend.append('_replyto', data.email);
    formDataToSend.append('_subject', `Portfolio Contact: ${data.subject}`);
    
    // Send to Formspree (you'll need to replace with your Formspree endpoint)
    fetch('https://formspree.io/f/xeorldyp', {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success state
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitBtn.style.background = 'var(--gradient-secondary)';
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 3000);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Show error state
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
        submitBtn.style.background = '#e74c3c';
        
        // Show error message
        showNotification('Failed to send message. Please try again or contact me directly at lakshmakandula@gmail.com', 'error');
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .notification-close:hover {
            background: rgba(255,255,255,0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--gradient-primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: var(--shadow-medium);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', scrollToTop);

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const greeting = document.querySelector('.greeting');
    if (greeting) {
        const originalText = greeting.textContent;
        typeWriter(greeting, originalText, 50);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to project cards
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .particle {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize skill bars animation
window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add focus management for accessibility
document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid var(--primary-color)';
        element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    animateSkillBars();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Add error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
    });
});

// Calculate years of experience dynamically
function calculateExperience() {
    const startDate = new Date('2016-07-01'); // July 2016 - Your start date
    const currentDate = new Date();
    
    // Calculate the difference in years
    let years = currentDate.getFullYear() - startDate.getFullYear();
    const monthDiff = currentDate.getMonth() - startDate.getMonth();
    
    // Adjust if we haven't reached the anniversary month yet
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < startDate.getDate())) {
        years--;
    }
    
    // Ensure we don't return negative years
    return Math.max(0, years);
}

// Calculate total months of experience (for more precise calculations)
function calculateExperienceInMonths() {
    const startDate = new Date('2016-07-01');
    const currentDate = new Date();
    
    const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
    const monthDiff = currentDate.getMonth() - startDate.getMonth();
    
    return (yearDiff * 12) + monthDiff;
}

// Get experience in a more detailed format (e.g., "7 years, 3 months")
function getDetailedExperience() {
    const totalMonths = calculateExperienceInMonths();
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (years === 0) {
        return `${months} months`;
    } else if (months === 0) {
        return `${years} years`;
    } else {
        return `${years} years, ${months} months`;
    }
}

// Update experience display
function updateExperienceDisplay() {
    const experienceYears = calculateExperience();
    const detailedExperience = getDetailedExperience();
    
    // Update the main experience stat card
    const experienceElement = document.getElementById('experience-years');
    const experienceDetail = document.getElementById('experience-detail');
    
    if (experienceElement) {
        experienceElement.textContent = `${experienceYears}+`;
    }
    
    if (experienceDetail) {
        experienceDetail.textContent = detailedExperience;
    }
    
    // Also update any text content that mentions years of experience
    const aboutText = document.querySelector('.about-card p');
    if (aboutText && aboutText.textContent.includes('5+ years')) {
        aboutText.textContent = aboutText.textContent.replace('5+ years', `${experienceYears}+ years`);
    }
    
    // Update hero description if it mentions years
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription && heroDescription.textContent.includes('5+ years')) {
        heroDescription.textContent = heroDescription.textContent.replace('5+ years', `${experienceYears}+ years`);
    }
    
    // Update any other elements that might contain hardcoded years
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        if (element.textContent && element.textContent.includes('5+ years')) {
            element.textContent = element.textContent.replace('5+ years', `${experienceYears}+ years`);
        }
    });
}

// Add click functionality to show/hide detailed experience
function addExperienceClickHandler() {
    const experienceCard = document.querySelector('.stat-card[title*="Started July 2016"]');
    const experienceDetail = document.getElementById('experience-detail');
    
    if (experienceCard && experienceDetail) {
        experienceCard.addEventListener('click', () => {
            if (experienceDetail.style.display === 'none' || experienceDetail.style.display === '') {
                experienceDetail.style.display = 'block';
                experienceCard.style.cursor = 'pointer';
            } else {
                experienceDetail.style.display = 'none';
            }
        });
        
        // Add hover effect
        experienceCard.addEventListener('mouseenter', () => {
            experienceCard.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        experienceCard.addEventListener('mouseleave', () => {
            experienceCard.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// Initialize experience calculation when page loads
window.addEventListener('load', () => {
    updateExperienceDisplay();
    addExperienceClickHandler();
    
    // Log the calculated experience to console for verification
    const years = calculateExperience();
    const detailed = getDetailedExperience();
    console.log(`%c📊 Experience Calculation:`, 'color: #06b6d4; font-weight: bold;');
    console.log(`Years: ${years}+`);
    console.log(`Detailed: ${detailed}`);
    console.log(`Start Date: July 2016`);
    console.log(`Current Date: ${new Date().toLocaleDateString()}`);
});

// Update experience display every hour (in case page is open for a long time)
setInterval(() => {
    updateExperienceDisplay();
}, 60 * 60 * 1000); // 1 hour

// Add console message
console.log('%c🚀 Welcome to LaxmaReddy\'s Portfolio!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using modern web technologies', 'color: #8b5cf6; font-size: 14px;');