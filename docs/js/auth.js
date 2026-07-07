// Check if user is logged in
function checkAuth() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userId = params.get('userId');

  if (token && userId) {
    // Store in localStorage
    localStorage.setItem('discord_token', token);
    localStorage.setItem('discord_userId', userId);
    
    // Update UI
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('dashboardBtn').style.display = 'block';
    
    document.getElementById('dashboardBtn').addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  } else if (localStorage.getItem('discord_token')) {
    // Already logged in
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('dashboardBtn').style.display = 'block';
    
    document.getElementById('dashboardBtn').addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }
}

checkAuth();