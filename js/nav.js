const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar');

hamburgerMenu.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Navigation Functionality
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove "active" from all links
        document.querySelectorAll('.nav-links a').forEach(item => item.classList.remove('active'));

        // Add "active" to the clicked link
        this.classList.add('active');

        // Show the relevant section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        const target = document.getElementById(this.getAttribute('data-target'));
        if (target) target.classList.add('active');
    });
});