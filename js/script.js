// script.js
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.content-section');

// Handle navigation and section display
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');

        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));

        // Show the targeted section
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

