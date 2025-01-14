function switchToSignup() {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("signupForm").style.display = "block";
      }
      
      function switchToLogin() {
        document.getElementById("signupForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
      }
      
      function validateForm(form) {
          let isValid = true;
          const inputs = form.querySelectorAll('input'); // Get all input fields in the form
          const errorDiv = form.querySelector('.form-error'); // Optional: Add a shared error div for feedback
          let errorMessage = '';
        
          inputs.forEach(input => {
            if (!input.value.trim()) {
              isValid = false;
              errorMessage = `${input.placeholder || input.name} is required.`;
            }
        
            // Additional validation for specific types
            if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
              isValid = false;
              errorMessage = 'Invalid email format.';
            }
        
            if (input.type === 'password' && input.value.length < 6) {
              isValid = false;
              errorMessage = 'Password must be at least 6 characters.';
            }
        
            // Add error class for invalid fields
            if (!isValid) {
              input.classList.add('error');
            } else {
              input.classList.remove('error');
            }
          });
        
          if (!isValid) {
            if (errorDiv) {
              errorDiv.textContent = errorMessage;
              errorDiv.style.display = 'block';
            } else {
              alert(errorMessage); // Fallback to an alert
            }
          } else if (errorDiv) {
            errorDiv.style.display = 'none'; // Clear previous errors
          }
        
          return isValid;
        }
        
      
      // Add async to the function
      document.getElementById("login").addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;
        const error = document.getElementById('login-error');
      
        alert(`Logged in with Username/Email: ${email}`);
        
        if (!validateForm(this)) {
          return;
        }
      
        try {
            const response = await fetch('http://localhost:4001/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
                alert(`Welcome back, ${data.user.name}!`);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = '\index.html';
            } else {
                alert(`Invalid Email or Password!`);
            }
        } catch (err) {
            error.textContent = 'An error occurred. Please try again later.';
            error.style.display = 'block';
        }
      });
      
      // Add async to the function
      document.getElementById("signup").addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("signupPassword").value;
        const error = document.getElementById('signup-error');
      
        alert(`Account created for ${name} (Email: ${email})`);
        
        if (!validateForm(this)) return;
      
        try {
            const response = await fetch('http://localhost:4001/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
                alert('Sign Up Successful! Redirecting to Login page...');
                switchToLogin();
            } else {
                if (error) {
                    error.textContent = data.message || 'Sign Up Failed!';
                    error.style.display = 'block';
                } else {
                    alert(data.message || 'Sign Up Failed!');
                }
            }
        } catch (err) {
            if (error) {
                error.textContent = 'An error occurred. Please try again later.';
                error.style.display = 'block';
            } else {
                alert('An error occurred. Please try again later.');
            }
        }
      });