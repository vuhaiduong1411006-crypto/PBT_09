// ─── DOM refs ─────────────────────────────────────────────────────────────────

const nameInput = document.querySelector("#name");
const nameIcon = document.querySelector("#nameIcon");
const nameError = document.querySelector("#nameError");

const emailInput = document.querySelector("#email");
const emailIcon = document.querySelector("#emailIcon");
const emailError = document.querySelector("#emailError");

const passwordInput = document.querySelector("#password");
const passwordIcon = document.querySelector("#passwordIcon");
const passwordError = document.querySelector("#passwordError");
const strengthFill = document.querySelector("#strengthFill");
const strengthLabel = document.querySelector("#strengthLabel");

const confirmInput = document.querySelector("#confirm");
const confirmIcon = document.querySelector("#confirmIcon");
const confirmError = document.querySelector("#confirmError");

const phoneInput = document.querySelector("#phone");
const phoneIcon = document.querySelector("#phoneIcon");
const phoneError = document.querySelector("#phoneError");

const submitBtn = document.querySelector("#submitBtn");
const form = document.querySelector("#registerForm");

const modalOverlay = document.querySelector("#modalOverlay");
const modalInfo = document.querySelector("#modalInfo");
const modalClose = document.querySelector("#modalClose");

// ─── Validation state ─────────────────────────────────────────────────────────

const valid = {
  name: false,
  email: false,
  password: false,
  confirm: false,
  phone: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setFieldState(input, icon, errorEl, isValid, errorMsg) {
  if (isValid) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    icon.textContent = "✅";
    errorEl.textContent = "";
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    icon.textContent = "❌";
    errorEl.textContent = errorMsg;
  }
}

function clearFieldState(input, icon, errorEl) {
  input.classList.remove("valid", "invalid");
  icon.textContent = "";
  errorEl.textContent = "";
}

function updateSubmitBtn() {
  submitBtn.disabled = !Object.values(valid).every(Boolean);
}

// ─── Validate name ────────────────────────────────────────────────────────────

nameInput.addEventListener("input", () => {
  const val = nameInput.value.trim();
  if (val === "") {
    clearFieldState(nameInput, nameIcon, nameError);
    valid.name = false;
  } else if (val.length < 2) {
    setFieldState(nameInput, nameIcon, nameError, false, "Tên phải có ít nhất 2 ký tự.");
    valid.name = false;
  } else if (val.length > 50) {
    setFieldState(nameInput, nameIcon, nameError, false, "Tên không được vượt quá 50 ký tự.");
    valid.name = false;
  } else {
    setFieldState(nameInput, nameIcon, nameError, true, "");
    valid.name = true;
  }
  updateSubmitBtn();
});

// ─── Validate email ───────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailInput.addEventListener("input", () => {
  const val = emailInput.value.trim();
  if (val === "") {
    clearFieldState(emailInput, emailIcon, emailError);
    valid.email = false;
  } else if (!val.includes("@")) {
    setFieldState(emailInput, emailIcon, emailError, false, "Email phải chứa ký tự @.");
    valid.email = false;
  } else if (!emailRegex.test(val)) {
    setFieldState(emailInput, emailIcon, emailError, false, "Email không đúng định dạng.");
    valid.email = false;
  } else {
    setFieldState(emailInput, emailIcon, emailError, true, "");
    valid.email = true;
  }
  updateSubmitBtn();
});

// ─── Validate password + strength ────────────────────────────────────────────

function getPasswordStrength(val) {
  if (val.length === 0) return 0;
  if (val.length < 8) return 1; // yếu

  const hasLower = /[a-z]/.test(val);
  const hasUpper = /[A-Z]/.test(val);
  const hasNumber = /[0-9]/.test(val);
  const hasSpecial = /[^a-zA-Z0-9]/.test(val);

  if (hasLower && hasUpper && hasNumber && hasSpecial) return 3; // mạnh
  if ((hasLower || hasUpper) && hasNumber) return 2; // trung bình
  return 1; // yếu
}

passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;

  if (val === "") {
    clearFieldState(passwordInput, passwordIcon, passwordError);
    strengthFill.style.width = "0%";
    strengthFill.style.background = "";
    strengthLabel.textContent = "";
    valid.password = false;
  } else {
    const strength = getPasswordStrength(val);

    if (strength === 1) {
      strengthFill.style.width = "33%";
      strengthFill.style.background = "#e74c3c";
      strengthLabel.style.color = "#e74c3c";
      strengthLabel.textContent = "Yếu";
      setFieldState(passwordInput, passwordIcon, passwordError, false, "Mật khẩu quá yếu.");
      valid.password = false;
    } else if (strength === 2) {
      strengthFill.style.width = "66%";
      strengthFill.style.background = "#f39c12";
      strengthLabel.style.color = "#f39c12";
      strengthLabel.textContent = "Trung bình";
      setFieldState(passwordInput, passwordIcon, passwordError, true, "");
      valid.password = true;
    } else {
      strengthFill.style.width = "100%";
      strengthFill.style.background = "#27ae60";
      strengthLabel.style.color = "#27ae60";
      strengthLabel.textContent = "Mạnh";
      setFieldState(passwordInput, passwordIcon, passwordError, true, "");
      valid.password = true;
    }
  }

  // Re-check confirm khi password thay đổi
  if (confirmInput.value !== "") validateConfirm();
  updateSubmitBtn();
});

// ─── Validate confirm password ────────────────────────────────────────────────

function validateConfirm() {
  const val = confirmInput.value;
  if (val === "") {
    clearFieldState(confirmInput, confirmIcon, confirmError);
    valid.confirm = false;
  } else if (val !== passwordInput.value) {
    setFieldState(confirmInput, confirmIcon, confirmError, false, "Mật khẩu không khớp.");
    valid.confirm = false;
  } else {
    setFieldState(confirmInput, confirmIcon, confirmError, true, "");
    valid.confirm = true;
  }
  updateSubmitBtn();
}

confirmInput.addEventListener("input", validateConfirm);

// ─── Validate phone + auto format ────────────────────────────────────────────

phoneInput.addEventListener("input", (e) => {
  // Chỉ giữ chữ số
  let digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);

  // Format: 0901-234-567
  let formatted = digits;
  if (digits.length > 4 && digits.length <= 7) {
    formatted = digits.slice(0, 4) + "-" + digits.slice(4);
  } else if (digits.length > 7) {
    formatted = digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7);
  }

  phoneInput.value = formatted;

  if (digits === "") {
    clearFieldState(phoneInput, phoneIcon, phoneError);
    valid.phone = false;
  } else if (digits.length !== 10) {
    setFieldState(phoneInput, phoneIcon, phoneError, false, "Số điện thoại phải đủ 10 chữ số.");
    valid.phone = false;
  } else if (!/^0[0-9]{9}$/.test(digits)) {
    setFieldState(phoneInput, phoneIcon, phoneError, false, "Số điện thoại không hợp lệ.");
    valid.phone = false;
  } else {
    setFieldState(phoneInput, phoneIcon, phoneError, true, "");
    valid.phone = true;
  }
  updateSubmitBtn();
});

// ─── Submit ───────────────────────────────────────────────────────────────────

form.addEventListener("submit", (e) => {
  e.preventDefault();

  modalInfo.innerHTML = "";

  const info = [
    { label: "Họ và tên", value: nameInput.value.trim() },
    { label: "Email", value: emailInput.value.trim() },
    { label: "Số điện thoại", value: phoneInput.value },
  ];

  info.forEach((item) => {
    const p = document.createElement("p");
    p.textContent = item.label + ": ";
    const span = document.createElement("span");
    span.textContent = item.value;
    p.appendChild(span);
    modalInfo.appendChild(p);
  });

  modalOverlay.classList.remove("hidden");
});

// ─── Modal close ──────────────────────────────────────────────────────────────

modalClose.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.add("hidden");
});
