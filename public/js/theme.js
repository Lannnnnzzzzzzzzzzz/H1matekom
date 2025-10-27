function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const icon = document.querySelector('.theme-toggle i');
  if (newTheme === 'dark') {
    icon.className = 'bi bi-sun-fill';
  } else {
    icon.className = 'bi bi-moon-stars';
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('show');
}

document.addEventListener('click', function(event) {
  const sidebar = document.querySelector('.sidebar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (sidebar && sidebar.classList.contains('show')) {
    if (!sidebar.contains(event.target) && (!mobileMenuBtn || !mobileMenuBtn.contains(event.target))) {
      sidebar.classList.remove('show');
    }
  }
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

if (savedTheme === 'dark') {
  const icon = document.querySelector('.theme-toggle i');
  if (icon) icon.className = 'bi bi-sun-fill';
}
