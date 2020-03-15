const EventEmitter = require('events');
const eventEmmiter = new EventEmitter();
const url = require('url');
const File = require('../miscellaneous/file.js');
const Firebase = require('../miscellaneous/firebase.js')

module.exports = {
    handleRequest: (request, response) => {
        response.writeHead(200, {'Content-Type': 'application/json'});
        switch(request.method){
            case 'GET':
                eventEmmiter.emit('onGetPetition', { request, response});
                break;
            case 'POST':
                onPostPetition(request, response);
                break;
            case 'PUT':
                onPutPetition(request, response);
                break;
            case 'DELETE':
                onDeletePetition(request, response);
                break;
            case 'OPTIONS':
                response.end();
                break;
        }
    }
}

function onPostPetition(request, response){
    let path = url.parse(request.url).pathname;

    switch(path){
        case '/createMovie':
            let data = [];
            request.on('data', chunk => {
                data.push(chunk)
            })
            request.on('end', async () => {
                let movie = JSON.parse(data).body.movie;
                await Firebase.updateMovie(movie);
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
    }
}

function onPutPetition(request, response){
    let path = url.parse(request.url).pathname;

    switch(path){
        case '/updateMovie':
            let data = [];
            request.on('data', chunk => {
                data.push(chunk) 
            })
            request.on('end', async () => {
                let movie = JSON.parse(data).body.movie;
                await Firebase.updateMovie(movie);
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
    }
}

function onDeletePetition(request, response){
    let path= url.parse(request.url).pathname;

    switch(path){
        case '/deleteMovie':
            let data = [];
            request.on('data', chunk => {
                data.push(chunk) 
            })
            request.on('end', async () => {
                let movie = JSON.parse(data).body.movie;
                await Firebase.deleteMovie(movie);
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
    }
}

eventEmmiter.on('onGetPetition', async data => {
    let {request, response} = data;
    let path = url.parse(request.url).pathname;
    switch(path){
        case '/getMoviesFromFile':
            File.readFile(__dirname +  '/../database/', 'movies.json')
                .then(data => {
                    response.write(JSON.stringify({data}));
                    response.end();
                }).catch(error => {
                    response.writeHead(500);
                    response.write(JSON.stringify({error}));
                    response.end();
                });                       
            break;
        case '/getMovies':
            let movies = await Firebase.getMovies();
            response.write(JSON.stringify({data: movies}));
            response.end();
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
    }
});