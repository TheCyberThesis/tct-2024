// document.addEventListener("DOMContentLoaded", function () {
//     const registrationForm = document.querySelector(".user");
//     const usernameInput = document.getElementById("username");
//     const emailInput = document.getElementById("email");
//     const passwordInput = document.getElementById("password");

//     // Regular expression for basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // Regular expression for password validation
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

//     function validateInput(input, regex) {
//         if (regex.test(input.value.trim())) {
//             input.classList.remove("is-invalid");
//             return true;
//         } else {
//             input.classList.add("is-invalid");
//             return false;
//         }
//     }

//     registrationForm.addEventListener("submit", function (event) {
//         let formIsValid = true;
//         let isUsernameValid = validateInput(usernameInput, /.+/); // Checks if not empty
//         let isEmailValid = validateInput(emailInput, emailRegex);
//         let isPasswordValid = validateInput(passwordInput, passwordRegex);

//         formIsValid = isUsernameValid && isEmailValid && isPasswordValid;

//         if (!formIsValid) {
//             event.preventDefault(); // Prevent the form from submitting
//         }
//         // If form is valid, it will proceed with submission (which should be handled server-side)
//     });

//     [usernameInput, emailInput, passwordInput].forEach(input => {
//         input.addEventListener("input", function () {
//             // Trigger the validation function on input
//             if (input === emailInput) {
//                 validateInput(input, emailRegex);
//             } else if (input === passwordInput) {
//                 validateInput(input, passwordRegex);
//             } else {
//                 validateInput(input, /.+/);
//             }
//         });
//     });
// });




// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.querySelector('.user');
//     form.addEventListener('submit', function(event) {
//         event.preventDefault();

//         const formData = new FormData(form);
//         fetch(form.action, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 username: formData.get('username'),
//                 email: formData.get('email'),
//                 password: formData.get('password')
//             })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Success:', data);
//             alert('Registration successful!');
//         })
//         .catch(error => {
//             console.error('Registration Error:', error);
//             alert('Failed to register, please check the console for more information.');
//         });
//     });
// });



// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.querySelector('form');
//     form.addEventListener('submit', function(event) {
//         event.preventDefault();

//         const formData = new FormData(form);
//         const data = {
//             username: formData.get('username'),
//             email: formData.get('email'),
//             password: formData.get('password')
//         };

//         fetch('/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//         .then(response => {
//             if (!response.ok) {
//                 // If the server response was not OK, throw an error to be caught later
//                 throw new Error('Failed to register');
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.message) {
//                 displayNotification('success', data.message);
//             } else {
//                 // If no message is provided, assume failure
//                 throw new Error('Unknown error occurred');
//             }
//         })
//         .catch(error => {
//             // Handle any errors that occur during fetch or due to response error
//             displayNotification('error', error.message);
//         });
        
//     });
//     function displayNotification(type, message) {
//             const successBox = document.querySelector('.success');
//             const errorBox = document.querySelector('.error');
//         if (type === 'success') {
//             successBox.textContent = message; // Set the text content of the success box
//             successBox.style.display = 'block'; // Show success box
//             errorBox.style.display = 'none'; // Hide error box
//         } else {
//             errorBox.textContent = message; // Set the text content of the error box
//             errorBox.style.display = 'block'; // Show error box
//             successBox.style.display = 'none'; // Hide success box
//         }
//     }
// });





document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        passwordInput.focus();
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
       
        // Toggle eye icon
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
});

