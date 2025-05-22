$(document).ready(function () {
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();

    $('#name, #email, #password, #registerBtn').prop('disabled', true);

    const userData = {
      name: $('#name').val(),
      email: $('#email').val(),
      password: $('#password').val(),
    };

    const errorBox = $('#errorBox');
    errorBox.addClass('d-none');

    if (!userData.name || !userData.email || !userData.password) {
      errorBox.text('Todos os campos são obrigatórios.').show();
      return;
    }

    if (userData.password.length < 6) {
      errorBox.text('A senha deve ter pelo menos 6 caracteres.');
      errorBox.removeClass('d-none');
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
        $('#name, #email, #password, #registerBtn').prop('disabled', false);
        window.location.href = '/login';
      },
      error: function (xhr) {
        console.log(xhr);
        const msg = xhr.responseJSON?.message || 'Erro ao cadastrar.';
        $('#name, #email, #password, #registerBtn').prop('disabled', false);
        alert(msg);
      },
    });
  });
});
