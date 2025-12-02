const nav = document.getElementById('nav');

var toolbar = loadAndRestoreElement("toolbar");
toolbar.style.height = '100%';

var tabElements = toolbar.querySelectorAll('.toolbarItem');

tabElements.forEach(function(element) {
    element.addEventListener('click', function() {
        if(element.hasAttribute('data-subject-id')){
            localStorage.setItem(
                "tab",
                JSON.stringify({
                    itemId: element.getAttribute('data-subject-id'),
                    itemType: "subject"
                })
            );
            window.location.href = './MainPage/screen.html';
        }

        if(element.hasAttribute('data-team-id')){
            localStorage.setItem(
                "tab",
                JSON.stringify({
                    itemId: element.getAttribute('data-team-id'),
                    itemType: "team"
                })
            );
            window.location.href = './MainPage/screen.html';
        }
    });
});

var homeBtn = toolbar.querySelector('.homeBtn');
homeBtn.addEventListener('click', function() {
    window.location.href = './MainPage/screen.html';
});

nav.appendChild(toolbar);