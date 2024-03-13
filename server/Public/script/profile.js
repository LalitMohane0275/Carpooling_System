document.addEventListener('DOMContentLoaded', function () {
    const indexLink = document.getElementById('indexLink');

    if (indexLink) {
        indexLink.addEventListener('click', function (event) {
            event.preventDefault(); 
            window.location.href = '/';
        });
    }

    const publishRideLink = document.getElementById('publishRideLink');

    if (publishRideLink) {
        publishRideLink.addEventListener('click', function (event) {
            event.preventDefault(); 
            window.location.href = '/publishRide';
        });
    }

    const searchRideLink = document.getElementById('searchRideLink');

    if (searchRideLink) {
        searchRideLink.addEventListener('click', function (event) {
            event.preventDefault(); 
            window.location.href = '/searchRide';
        });
    }

    const aboutLink = document.getElementById('aboutLink');

    if (aboutLink) {
        aboutLink.addEventListener('click', function (event) {
            event.preventDefault(); 
            window.location.href = '/about';
        });
    }

    const profileLink = document.getElementById('profileLink');

    if (profileLink) {
        profileLink.addEventListener('click', function (event) {
            event.preventDefault(); 
            window.location.href = '/profile';
        });
    }
});