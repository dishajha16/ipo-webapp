// Handle the logo upload action
document.querySelector('.upload-btn').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              const img = document.querySelector('.company-logo');
              img.src = e.target.result;  // Update image with the selected file
          };
          reader.readAsDataURL(file);
      }
  };
  
  input.click();  // Trigger the file input click
});

// Handle the logo delete action
document.querySelector('.delete-btn').addEventListener('click', () => {
  const img = document.querySelector('.company-logo');
  img.src = 'placeholder-logo.png';  // Reset the logo to default placeholder
});

// Handle form submission
const registerButton = document.querySelector('.register');
const form = document.getElementById('ipo-form');
const successMessage = document.getElementById('success-message');

registerButton.addEventListener('click', function() {
    if (form.checkValidity()) { // Ensure all fields are valid
        successMessage.style.display = 'block';
        form.reset(); // Reset the form fields
        setTimeout(() => successMessage.style.display = 'none', 3000); // Hide success message
    } else {
        alert("Please fill in all the required fields.");
    }
});

// Handle the cancel button action
const cancelButton = document.querySelector('.cancel');
cancelButton.addEventListener('click', function() {
    const userConfirmed = confirm("Are you sure you want to cancel? This will reset the form.");
    if (userConfirmed) {
        form.reset(); // Reset the form fields
    }
});
