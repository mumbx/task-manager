$(document).ready(function () {
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();
    const errorBox = $('#errorBox');

    $('#email, #password, #loginBtn').prop('disabled', true);
    errorBox.addClass('d-none');
    showLoading();

    if (!email || !password) {
      errorBox.text('E-mail e senha são obrigatórios.').removeClass('d-none');
      $('#email, #password, #loginBtn').prop('disabled', false);
      hideLoading();
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/auth/login',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (response) {
        window.location.href = '/dashboard';
      },
      error: function (xhr) {
        console.error(xhr);
        const msg = xhr.responseJSON?.message || 'Falha no login.';
        errorBox.text(msg).removeClass('d-none');
      },
      complete: function () {
        $('#email, #password, #loginBtn').prop('disabled', false);
        hideLoading();
      }
    });
  });
});
