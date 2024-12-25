const themeSwitch = document.getElementById('theme-switch');

// Check for saved theme preference in localStorage
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeSwitch.checked = true;
} else {
  document.body.classList.add('light');
}

// Toggle theme
themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});
