$(document).ready(function () {
  $('#logoutBtn').on('click', function (e) {
    e.preventDefault();

    $.ajax({
      type: 'POST',
      url: '/auth/logout',
      xhrFields: {
        withCredentials: true,
      },
      success: function () {
        localStorage.clear();
        window.location.href = '/login';
      },
      error: function (xhr) {
        console.error('Erro ao fazer logout:', xhr);
        alert('Erro ao fazer logout. Tente novamente.');
      }
    });
  });
});