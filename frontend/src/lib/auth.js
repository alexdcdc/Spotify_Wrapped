
function isAuthenticated() {
  return !!sessionStorage.getItem("token");
}

function logout() {
  sessionStorage.removeItem('token')
  window.location.href="http://localhost:3000"
}


export { isAuthenticated, logout}
