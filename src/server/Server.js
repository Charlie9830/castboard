const EventEmitter = require('events');
const express = require('express');
const bodyParser = require('body-parser');
const EventTypes = require('./EventTypes');
const App = express();
const Router = express.Router();
const Port = 8081;
const path = require('path');



class Server extends EventEmitter {
    constructor() {
        super();

        // Method Bindings.
        this.handleRootRequest = this.handleRootRequest.bind(this);
        this.handleDataRequest = this.handleDataRequest.bind(this);
        this.handleDataPost = this.handleDataPost.bind(this);
        this.handlePlaybackPost = this.handlePlaybackPost.bind(this);

        // Server Setup.
        App.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });

        App.use('/', express.static(path.join(__dirname, 'remote')));
        App.use(bodyParser.urlencoded({ extended: true }));
        App.use(bodyParser.json());

        Router.get('/', this.handleRootRequest);
        Router.get('/data', this.handleDataRequest);
        Router.post('/data', this.handleDataPost);

        // Playback Controls
        Router.post('/playback/pause', (req, res) => this.handlePlaybackPost("pause", req, res));
        Router.post('/playback/play', (req, res) => this.handlePlaybackPost("play", req, res));
        Router.post('/playback/prev', (req, res) => this.handlePlaybackPost("prev", req, res));
        Router.post('/playback/next', (req, res) => this.handlePlaybackPost("next", req, res));

        App.use(Router);

        App.listen(Port);

        console.log("Server is listening on Port " + Port);
    }

    handlePlaybackPost(action, req, res) {
        res.sendStatus(200);
        this.emit(EventTypes.playbackAction, action);
    }

    handleDataPost(req, res) {
        let data = req.body;
        res.sendStatus(200);
        
        this.emit(EventTypes.receiveData, data);
    }

    handleDataRequest(req, res) {
        this.getDataFromElectronAsync().then( data => {
            res.json(data);
        })
    }

    handleRootRequest(req, res) {
    }

    getDataFromElectronAsync() {
        return new Promise( (resolve, reject) => {
            this.emit(EventTypes.getData, (data) => {
                resolve(data);
            });
        })
    }
}


module.exports = Server;