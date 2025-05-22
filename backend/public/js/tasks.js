$(document).ready(function () {
  const userId = $('#user-info').data('user-id');

  if (!userId) {
    console.error('ID do usuário não encontrado.');
    return;
  }

  showLoading();
  fetchTasks(userId);

  function fetchTasks(userId) {
    $.ajax({
      url: `http://localhost:9000/tasks/user/${userId}`,
      method: 'GET',
      success: function (response) {
        renderTasks(response.tasks);
      },
      error: function (xhr) {
        if (xhr.status === 404) {
          renderNoTasks();
        } else {
          console.error(
            'Erro ao buscar tarefas:',
            xhr.responseJSON?.message || xhr.statusText,
          );
        }
      },
      complete: function () {
        hideLoading();
      },
    });
  }

  function renderTasks(tasks) {
    const tbody = $('#tasksTable tbody');
    tbody.empty();

    if (!tasks || tasks.length === 0) {
      renderNoTasks();
      return;
    }
    tasks.forEach((task) => {
      const row = `
        <tr id="${task.id}">
          <td>${task.title}</td>
          <td>${task.description || ''}</td>
          <td>${formatStatus(task.status)}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-primary edit-task mx-auto" data-id="${task.id}">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-task mx-auto" data-id="${task.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
      tbody.append(row);
    });
  }

  function renderNoTasks() {
    const tbody = $('#tasksTable tbody');
    tbody.empty();
    tbody.append(`
      <tr>
        <td colspan="4" class="text-center text-muted">Nenhuma tarefa encontrada.</td>
      </tr>
    `);
  }

  function formatStatus(status) {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'IN_PROGRESS':
        return 'Em andamento';
      case 'COMPLETED':
        return 'Concluída';
      default:
        return status;
    }
  }

  $('#btnAddTask').on('click', function () {
    $('#createTaskForm')[0].reset();
    $('#taskErrorBox').addClass('d-none').text('');
    const modal = new bootstrap.Modal(
      document.getElementById('createTaskModal'),
    );
    modal.show();
  });

  $('#createTaskForm').on('submit', function (e) {
    e.preventDefault();

    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const status = $('#taskStatus').val();
    const errorBox = $('#taskErrorBox');

    $('#taskTitle, #taskDescription, #taskStatus, #saveTaskBtn').prop(
      'disabled',
      true,
    );
    errorBox.addClass('d-none');
    showLoading();

    if (!title || !description) {
      errorBox
        .text('Título e descrição são obrigatórios.')
        .removeClass('d-none');
      $('#taskTitle, #taskDescription, #taskStatus, #saveTaskBtn').prop(
        'disabled',
        false,
      );
      hideLoading();
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/tasks',
      contentType: 'application/json',
      data: JSON.stringify({ title, description, status, userId }),
      success: function () {
        const modalEl = document.getElementById('createTaskModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        fetchTasks(userId);
      },
      error: function (xhr) {
        const msg = xhr.responseJSON?.message || 'Erro ao criar tarefa.';
        errorBox.text(msg).removeClass('d-none');
      },
      complete: function () {
        $('#taskTitle, #taskDescription, #taskStatus, #saveTaskBtn').prop(
          'disabled',
          false,
        );
        hideLoading();
      },
    });
  });

  //deleção da task

  let taskIdToDelete = null;
  const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));

  $('#tasksTable').on('click', '.delete-task', function () {
    taskIdToDelete = $(this).data('id');
    confirmDeleteModal.show();
  });

  $('#confirmDeleteBtn').on('click', function () {
    if (!taskIdToDelete) return;

    $.ajax({
      url: `/tasks/${taskIdToDelete}`,
      type: 'DELETE',
      success: function () {
        confirmDeleteModal.hide();
        fetchTasks($('#user-info').data('user-id'));
      },
      error: function (xhr) {
        alert(xhr.responseJSON?.message || 'Erro ao excluir a tarefa.');
      }
    });
  });


  // edição da task
  $('#tasksTable').on('click', '.edit-task', function () {
    const taskId = $(this).data('id');
  
    $.ajax({
      url: `/tasks/${taskId}`,
      method: 'GET',
      success: function (task) {
        $('#taskTitle').val(task.title);
        $('#taskDescription').val(task.description);
        $('#taskStatus').val(task.status);
        $('#taskErrorBox').addClass('d-none').text('');
  
        $('#createTaskModalLabel').text('Editar Tarefa');
  
        $('#saveTaskBtn').text('Atualizar');
  
        $('#createTaskForm').data('task-id', taskId);
  
        const modal = new bootstrap.Modal(document.getElementById('createTaskModal'));
        modal.show();
      },
      error: function () {
        alert('Erro ao carregar dados da tarefa para edição.');
      }
    });
  });
  
  $('#createTaskForm').off('submit').on('submit', function (e) {
    e.preventDefault();
  
    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const status = $('#taskStatus').val();
    const errorBox = $('#taskErrorBox');
    const taskId = $(this).data('task-id');
  
    $('#taskTitle, #taskDescription, #taskStatus, #saveTaskBtn').prop('disabled', true);
    errorBox.addClass('d-none');
    showLoading();
  
    if (!title || !description) {
      errorBox.text('Título e descrição são obrigatórios.').removeClass('d-none');
      $('#taskTitle, #taskDescription, #taskStatus, #saveTaskBtn').prop('disabled', false);
      hideLoading();
      return;
    }
  
    const ajaxOptions = {
      contentType: 'application/json',
      data: JSON.stringify({ title, description, status }),
      success: function () {
        const modalEl = document.getElementById('createTaskModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        fetchTasks(userId);
        $('#createTaskForm')[0].reset();
        $('#createTaskForm').removeData('task-id');
        $('#createTaskModalLabel').text('Nova Tarefa');
        $('#saveTaskBtn').text('Salvar');
      },
      error: function (xhr) {
        const msg = xhr.responseJSON?.message || 'Erro ao salvar tarefa.';
        errorBox.text(msg).removeClass('d-none');
      },
      complete: function () {
        $('#taskTitle, #taskDescription, #taskStatus, #saveTaskBtn').prop('disabled', false);
        hideLoading();
      }
    };
  
    if (taskId) {
      ajaxOptions.url = `/tasks/${taskId}`;
      ajaxOptions.type = 'PUT';
    } else {
      ajaxOptions.url = '/tasks';
      ajaxOptions.type = 'POST';
      ajaxOptions.data = JSON.stringify({ ...JSON.parse(ajaxOptions.data), userId });
    }
  
    $.ajax(ajaxOptions);
  });

});
