// var rightHere = window.location.pathname;
// var pieces = rightHere.split('/');
// console.log(rightHere);
// console.log(pieces);
// var id = pieces[2];
// console.log(id);
// // alert('Single View');

$(document).ready(function() {

var $singleChirp = $('#single-chirp');

function addSingleChirpDiv(chirp) {
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
    $chirpDiv.appendTo($singleChirp);
}


function getSingleChirp(id) {
    $.ajax({
        method: 'GET',
        url: '/chirps/' + id
    }).then(function(chirps) {
        var rightHere = window.location.pathname;
        var pieces = rightHere.split('/');
        var id = pieces[2];
        addSingleChirpDiv(chirps[;
        console.log(id);
    }, function(err) {
        console.log(err);
    });
}

getSingleChirp();
});