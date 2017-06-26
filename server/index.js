// Variables
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'chirpuser',
    password: 'chirp123',
    database: 'Chirper'
});

var clientPath = path.join(__dirname, "../client");
var app = express();

// Processes
app.use(express.static(clientPath));
app.use(bodyParser.json());

app.get('/chirps', function(req, res) {
    res.sendFile(path.join(clientPath, 'list.html'));
});

app.get('/chirps/*/update', function(req, res) {
    res.sendFile(path.join(clientPath, 'single_update.html'));
});  

app.get('/chirps/:id', function(req, res) {
    rows('GetChirps', [req.params.id])
    .then(function() {
    res.sendFile(path.join(clientPath, 'single_view.html'));
    });
});

app.route('/api/chirps')
    .get(function(req, res) {
        rows('GetChirps')
        .then(function(chirps) {
            res.send(chirps);
        }, function(err) {
            res.status(500).send(err);
        });
    })
    .post(function(req, res) {
        var newChirp = req.body;
        row('InsertChirp', [newChirp.message, newChirp.userid])
        // createChirp(req.body.message, req.body.user)
        .then(function(id) {
            res.status(201).send(id);
        },function(err) {
            res.status(500).send(err);
        });
    });

app.route('/api/chirps/:id')
    .get(function(req, res) {
        row('GetChirp', [req.params.id])
        .then(function(chirp) {
            res.send(chirp);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).put(function(req, res) {
        empty('UpdateChirp', [req.params.id, req.body.message])
            .then(function() {
                res.sendStatus(204);
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    }).delete(function(req, res) {
        empty('DeleteChirp', [req.params.id])
            .then(function() {
                res.sendStatus(204);
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            })
    });

app.get('/api/users', function(req, res) {
    rows('GetUsers')
    .then(function(users) {
        res.send(users);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    })
});

app.listen(3000);

// Functions 
function getChirps() {
    return new Promise(function(fulfill, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject (err);
            }
            else {
                connection.query('CALL GetChirps();', function(err, sets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(sets[0]);
                    }
                });
            }
        });
    });

function createChirp(message, user) {
    return new Promise(function(fulfill, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject (err);
            } else {
                connection.query('CALL InsertChirp(?,?);', [message, user], function(err, sets) {
                    connection.release();
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        fulfill(sets[0][0]);
                    }
                });
            }
            });
        });
    }
}

function callProcedure(procedureName, args) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject (err);
            } else {
                var placeholders = '';
                if (args && args.length > 0) {
                    for (var i=0; i < args.length; i++) {
                        if (i === args.length - 1) {
                            placeholders += '?';
                        } else {
                            placeholders += '?,';
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeholders + ');';
                connection.query(callString, args, function(err, sets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(sets);
                    }
                });
            }
        });
    });
}

function rows(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(sets) {
            return sets[0];
        });
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(sets) {
            return sets[0][0];
        });
}

function empty(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function() {
            return;
        });
}