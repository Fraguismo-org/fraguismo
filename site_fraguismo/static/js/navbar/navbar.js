document.addEventListener('DOMContentLoaded', function () {
    let subMenuToggles = document.querySelectorAll('.dropdown-menu .dropdown-toggle');
    let lastSubMenu;

    subMenuToggles.forEach(function (toggle) {
        let parentLi = toggle.parentElement;

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            let subMenu = this.nextElementSibling;
            if (subMenu && subMenu.classList.contains('dropdown-menu')) {
                subMenu.classList.toggle('show');
                if (lastSubMenu && lastSubMenu !== subMenu) {
                    lastSubMenu.classList.remove('show');
                }
                lastSubMenu = subMenu;
            }
        });
    });
});