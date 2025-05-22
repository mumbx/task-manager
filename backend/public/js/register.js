$(document).ready(function () {
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();

    $('#name, #email, #password, #registerBtn').prop('disabled', true);
    showLoading();

    const userData = {
      name: $('#name').val(),
      email: $('#email').val(),
      password: $('#password').val(),
    };

    const errorBox = $('#errorBox');
    errorBox.addClass('d-none');

    if (!userData.name || !userData.email || !userData.password) {
      errorBox.text('Todos os campos são obrigatórios.').removeClass('d-none');
      $('#name, #email, #password, #registerBtn').prop('disabled', false);
      hideLoading();
      return;
    }

    if (userData.password.length < 6) {
      errorBox.text('A senha deve ter pelo menos 6 caracteres.').removeClass('d-none');
      $('#name, #email, #password, #registerBtn').prop('disabled', false);
      hideLoading();
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/users',
      contentType: 'application/json',
      data: JSON.stringify(userData),
      success: function (response) {
        console.log(response);
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login';
      },
      error: function (xhr) {
        console.log(xhr);
        const msg = xhr.responseJSON?.message || 'Erro ao cadastrar.';
        alert(msg);
      },
      complete: function () {
        $('#name, #email, #password, #registerBtn').prop('disabled', false);
        hideLoading();
      }
    });
  });
});
