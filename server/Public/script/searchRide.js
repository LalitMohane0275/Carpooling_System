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

function create_card(start, dest, time, charges, seats, preferences) {
    // finish this function
    let html = `<div class="card">
        <h2><b>Starting point : ${start}</b></h2>
        <h2><b>Destination : ${dest}</b></h2>
        <p>Start time : ${time}</p>
        <p>Charge per person : ${charges}</p>
        <p>No of seats : ${seats}</p>
        <p>preferences : ${preferences}</p>
    </div>`

    document.querySelector(".find-ride").innerHTML += html;
}

create_card("pune", "palghar", "5:5", 500, 2, "no");