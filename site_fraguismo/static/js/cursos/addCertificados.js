document.addEventListener('DOMContentLoaded', function () {
    let selectAllCheckbox = document.getElementById('select_all');
    const usuarioCheckboxes = document.querySelectorAll('input[name="usuario_check"]');

    selectAllCheckbox.addEventListener('change', function () {
        usuarioCheckboxes.forEach(function (checkbox) {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
});