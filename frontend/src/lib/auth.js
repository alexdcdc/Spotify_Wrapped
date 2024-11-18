
function isAuthenticated() {
  return !!sessionStorage.getItem("token");
}

function logout() {
  localStorage.removeItem('token')
  window.location.href="http://localhost:3000"
}


export { isAuthenticated }