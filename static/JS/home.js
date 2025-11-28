// js/home.js - Home Page Basic Functionality for Hospital Readmission System

/** 
 * Home Page JavaScript Module
 * Handles basic interactive functionality for the home page
 * Simplified version without authentication
 */

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hospital Readmission System - Home Page Loaded');
    
    // Initialize basic home page functionality
    initHomePage();
});

/**
 * Main initialization function for home page features
 */
function initHomePage() {
    try {
        // Initialize navigation active states
        initNavigation();
        
        // Initialize feature card animations
        initFeatureAnimations();
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        // Initialize button interactions
        initButtonInteractions();
        
        console.log('Basic home page modules initialized successfully');
    } catch (error) {
        console.error('Error initializing home page:', error);
    }
}

/**
 * Initialize navigation menu active states
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Update active state based on current page
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    console.log('Navigation initialized with', navLinks.length, 'links');
}

/**
 * Initialize animations for feature cards
 */
function initFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const featureObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCardIn(entry.target);
            }
        });
    }, observerOptions);
    
    // Initialize each feature card with observer
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        featureObserver.observe(card);
    });
    
    console.log('Feature animations initialized for', featureCards.length, 'cards');
}

/**
 * Animate feature card into view when scrolled to
 */
function animateCardIn(card) {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('Smooth scrolling initialized for', anchorLinks.length, 'anchor links');
}

/**
 * Initialize basic button interactions
 */
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    console.log('Button interactions initialized for', buttons.length, 'buttons');
}

/**
 * Create ripple effect on button click
 */
function createRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Utility function to check if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

console.log('Home page basic JavaScript loaded successfully');