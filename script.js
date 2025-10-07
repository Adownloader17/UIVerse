document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            category: document.getElementById('category').value,
            rating: document.querySelector('input[name="rating"]:checked')?.value,
            message: document.getElementById('message').value,
            subscribe: document.getElementById('subscribe').checked
        };

        // Log the feedback (in a real application, this would be sent to a server)
        console.log('Feedback submitted:', formData);

        // Store in localStorage as a simple example
        const feedbackHistory = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
        feedbackHistory.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory));

        // Hide form and show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Reset form after 3 seconds and show it again
        setTimeout(function() {
            form.reset();
            form.style.display = 'flex';
            successMessage.style.display = 'none';
        }, 3000);
    });

    // Add real-time validation feedback
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
        });
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailPattern.test(this.value)) {
            this.style.borderColor = '#dc3545';
        } else if (this.value) {
            this.style.borderColor = '#28a745';
        }
    });
});
