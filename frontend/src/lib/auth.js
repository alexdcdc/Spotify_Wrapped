function isAuthenticated() {
  return !!sessionStorage.getItem("token");
}
