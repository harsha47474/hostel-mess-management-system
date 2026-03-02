
  const deleteModal = document.getElementById('deleteModal');

  deleteModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const studentId = button.getAttribute('data-id');
    const studentName = button.getAttribute('data-name');

    const form = document.getElementById('deleteForm');
    const nameDisplay = document.getElementById('studentName');

    form.action = `/admins/students/delete/${studentId}`;
    nameDisplay.textContent = studentName;
  });
