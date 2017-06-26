var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');
var $userSelector = $('#users');

function addChirpDiv(chirp) {
    var $chirpLink = $('<a href="/chirps/' + chirp.id + '"></a>');
    var $chirpDiv = $('<div class="chirp"></div>');
    var $message = $('<p></p>');
    var $user = $('<h4></h4>');
    var $timestamp = $('<h5></h5>');
    var $delButton = $('<button class="delete-button">Delete</button>');
    var $separator = $('<hr>');
    
    $delButton.click(function() {
        deleteChirp(chirp.id);
    });
    $message.text(chirp.message);
    $user.text(chirp.userName);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());
    $message.appendTo($chirpDiv);
    $user.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $delButton.appendTo($chirpDiv);
    $separator.appendTo($chirpDiv);
    $chirpDiv.appendTo($chirpLink);
    $chirpLink.appendTo($chirpList);
}

$chirpField.on('input', function() {
    var isEmpty = $chirpField.val().length === 0; // essentially an if statement, returns boolean
    $chirpButton.prop('disabled', isEmpty); // since isEmpty is boolean, we can use it 
});

$chirpButton.click(postChirp);

function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        userid: $userSelector.val()
        // timestamp: new Date().toISOString() //when stringifying, JSON will turn it into readable but this is the tighter way of doing it.
    }
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success) {
        // successful POST
        $chirpField.val(''); // Setter. Pass a blank string to the Chirp field.
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err) {
        // err occurred
        console.log(err);
    });
}

function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function(chirps) {
        $chirpList.empty();
        for (var i=0; i < chirps.length; i++) {
            addChirpDiv(chirps[i]);
        }
    }, function(err) {
        console.log(err);
    });
}

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id,
    }).then(function() {
        getChirps();
    }, function(err) {
        console.log(err);
    });
}

function populateUsers() {
    $.ajax({
        method: 'GET',
        url: '/api/users' 
    }).then(function(users) {
        for(var i=0; i < users.length; i++) {
            var $userOption = $('<option value= "' + users[i].id + '">' + users[i].name + '</option>');
            $userSelector.append($userOption);
        }
    })
}

populateUsers();
getChirps();