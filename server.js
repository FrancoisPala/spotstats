import Hapi from 'hapi';
import request from 'request';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
const conf = require('./config-perso');

const client_id = conf.client_id;
const client_secret = conf.client_secret;
const redirect_uri = conf.redirect_uri;

const server = new Hapi.Server();

const generateRandomString = (length) => {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

server.connection({
    host: 'localhost',
    port: 9000,
    routes: {
        cors: true,
    },
});

server.route({
    method: 'GET',
    path: '/',
    handler: (req, rep) => {
        console.log("coucou");
        rep('Hello World');
    }
});

server.route({
    method: 'GET',
    path: '/login',
    handler: (req, rep) => {
        const rand = generateRandomString(16);
        console.log(rand);
        const scope = 'user-read-private user-read-email';

        rep.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: rand
        }));
    }
});

server.route({
    method: 'GET',
    path: '/callback',
    handler: (req, rep) => {
        console.log(req.query);
        rep('Hello callback');
    }
});


server.start(() => {
    console.log('Server started on port: ' + server.info.port);
});

module.exports = server;
