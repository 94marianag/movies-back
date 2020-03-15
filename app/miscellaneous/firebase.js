const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');

const firebaseCofig = {   
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        databaseURL: process.env.databaseURL,
        projectId: process.env.projectId,
        storageBucket: process.env.storageBucket,
        messagingSenderId: process.env.messagingSenderId,
        appId: process.env.appId     
}

firebase.initializeApp(firebaseCofig);
const database = firebase.database();

//Funcion que lee todas as peliculas de la base de datos
function getMoviesFromDB () {
    return new Promise((resolve, reject) => {
        database.ref('/movies').once('value')
        .then((snapshot) => {
            let movies = [];
            let results = snapshot.val();

            for(let key in results){ //Lo que teniamos en clase
                movies.push(results[key]);
            }
        //     for (let key in results) {
        //         movies[key] = results[key];
        //    }
            resolve(movies);
        }).catch(error => {
            resolve([]);
            console.log(error);
        });
    });   
};

module.exports = {
    getMovies: () => {
        return getMoviesFromDB();
    },
    updateMovie: async (movie) => {
        let movies = await getMoviesFromDB();
        let position = movies.findIndex(m => {
            return m.id === movie.id;
        });
        return new Promise((resolve, reject) => {
            firebase.database().ref('/movies/' + position).set(movie)
            .then(() => {
                resolve(movie);
            }).catch(err => {
                reject(err);
                console.log(err);
            });
        });
    },
    deleteMovie: async (movie) => {
        let movies = await getMoviesFromDB();
        let position = movies.findIndex(m => {
            return m.id === movie.id;
        });
        return new Promise((resolve, reject) => {
            firebase.database().ref('/movies/' + position).remove()
            .then(() => {
                resolve(movie);
            }).catch(err => {
                reject(err);
                console.log(err);
            });
        });
    }
};