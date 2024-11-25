const togglePassword = document.getElementById("toggleIcon");
const toggleIconConfirmPass = document.getElementById("toggleIconConfirmPass");
const getPassword = document.getElementById("password");
const getConfirmPassword = document.getElementById("confirm");
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const getInputFields = document.querySelectorAll("input");

togglePassword?.addEventListener("click", () => {
  if (getPassword.type === "password") {
    togglePassword.src = "assets/images/icons8_hide_1.svg";
    getPassword.type = "text";
  } else {
    togglePassword.src = "assets/images/icons8_eye_2.svg";
    getPassword.type = "password";
  }
});

toggleIconConfirmPass?.addEventListener("click", () => {
  if (getConfirmPassword.type === "password") {
    toggleIconConfirmPass.src = "assets/images/icons8_hide_1.svg";
    getConfirmPassword.type = "text";
  } else {
    toggleIconConfirmPass.src = "assets/images/icons8_eye_2.svg";
    getConfirmPassword.type = "password";
  }
});

const api = axios.create({
  // baseURL: `http://localhost:3002/api/v1/`,
  baseURL: `https://taskmaster-tauu.onrender.com/api/v1`,
  //   baseURL: `https://7l7wjdmm-3001.euw.devtunnels.ms/api/v1/`,
});

/* Signup section */
const signUpForm = document.getElementById("signUpForm");
const successfulAccount = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  timer: 3000, // Auto-close after 2 seconds
});

signUpForm?.addEventListener("submit", (e) => {
  signUpBtn.textContent = "loading....";
  signUpBtn.disabled = true;
  e.preventDefault();
  const signUpValues = {};
  const form = new FormData(e.target);
  form.forEach((value, name) => (signUpValues[name] = value));

  api
    .post(`users/create`, JSON.stringify(signUpValues), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((value) => {
      signUpBtn.textContent = "Sign up";
      signUpBtn.disabled = false;
      successfulAccount
        .fire({
          icon: "success",
          title: "Account created Successfully.",
        })
        .then(() => {
          // Redirect to landing page after success
          window.location.href = "login.html"; // Replace with your landing page URL
        });
    })
    .catch((err) => {
      signUpBtn.textContent = "Sign up";
      signUpBtn.disabled = false;
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "SignUp Failed",
        text: err?.response?.data?.message || err.message,
        // 'Invalid username or password. Please try again!',
      });
    });
});

/* Login section */
const loginForm = document.getElementById("loginForm");
const successfulLogin = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  timer: 3000, // Auto-close after 2 seconds
});

loginForm?.addEventListener("submit", (e) => {
  loginBtn.textContent = "loading....";
  loginBtn.disabled = true;
  e.preventDefault();
  const loginValues = {};
  const form = new FormData(e.target);
  form.forEach((value, name) => (loginValues[name] = value));

  api
    .post(`users/login`, JSON.stringify(loginValues), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(async (value) => {
        console.log(value)
      loginBtn.textContent = "Log in";
      loginBtn.disabled = false;
      const user = value.data.message;
      saveUserCredentials(user);
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Login Successful',
      //   text: `Welcome ${user.fullName}`,
      //   showConfirmButton: false,
      //   timer: 2000, // Auto-close after 2 seconds
      // })
      successfulAccount
        .fire({
          icon: "success",
          title: `Welcome ${user.firstName}`,
        })
        .then(() => {
          // Redirect to landing page after success
          window.location.href = "dashboard.html"; // Replace with your landing page URL
        });
    })
    .catch((err) => {
      loginBtn.textContent = "Log in";
      loginBtn.disabled = false;
      Swal.fire({
        icon: "error",
        title: "SignUp Failed",
        text: err?.response?.data?.message || err?.message,
        // 'Invalid username or password. Please try again!',
      });
    });
});

function saveUserCredentials(user) {
  // Check if credentials exist in localStorage
  let savedCredentials = localStorage.getItem("TaskMaster");

  if (savedCredentials) {
    // Parse existing credentials and update with new values
    savedCredentials = JSON.parse(savedCredentials);
    saveUserCredentials = user;
  } else {
    // Create new credentials object
    savedCredentials = user;
  }

  localStorage.setItem("TaskMaster", JSON.stringify(savedCredentials));
}
