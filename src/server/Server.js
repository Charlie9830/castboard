const EventEmitter = require('events');
const express = require('express');
const bodyParser = require('body-parser');
const EventTypes = require('./EventTypes');
const App = express();
const Router = express.Router();
const Port = 8081;
const path = require('path');
const jetpack = require('fs-jetpack');
const multer = require('multer');
const os = require('os');
const exec = require('child_process').exec;

class Server extends EventEmitter {
    constructor() {
        super();

        // Method Bindings.
        this.handleRootRequest = this.handleRootRequest.bind(this);
        this.handleDataRequest = this.handleDataRequest.bind(this);
        this.handleDataPost = this.handleDataPost.bind(this);
        this.handlePlaybackPost = this.handlePlaybackPost.bind(this);
        this.setElectronLogFilePath = this.setElectronLogFilePath.bind(this);
        this.handleLogsRequest = this.handleLogsRequest.bind(this);
        this.handleControlPost = this.handleControlPost.bind(this);
        this.handleShowFilePost = this.handleShowFilePost.bind(this);
        this.handleGetPing = this.handleGetPing.bind(this);

        // Class Storage.
        this.electronLogFilePath = "";

        // Server Setup.
        App.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });

        App.use('/', express.static(path.join(__dirname, 'remote')));
        App.use(bodyParser.urlencoded({ extended: true }));
        App.use(bodyParser.json());

        // Root
        Router.get('/', this.handleRootRequest);
        Router.get('/ping', this.handleGetPing);

        // Cast/Orchestra Change Data.
        Router.get('/data', this.handleDataRequest);
        Router.post('/data', this.handleDataPost);

        // Playback Controls
        Router.post('/playback/pause', (req, res) => this.handlePlaybackPost("pause", req, res));
        Router.post('/playback/play', (req, res) => this.handlePlaybackPost("play", req, res));
        Router.post('/playback/prev', (req, res) => this.handlePlaybackPost("prev", req, res));
        Router.post('/playback/next', (req, res) => this.handlePlaybackPost("next", req, res));

        // Show File
        Router.post('/showfile', multer().single('showfile'), this.handleShowFilePost);

        // Reset
        Router.post('/control', this.handleControlPost)

        // Logs
        Router.get('/logs', this.handleLogsRequest);

        App.use(Router);

        App.listen(Port);

        console.log("Server is listening on Port " + Port);
    }

    handleGetPing(req, res) {
        res.json({reply: "pong"});
    }

    handleShowFilePost(req, res) {
        res.sendStatus(200);
        let file = req.file;

        let showfile = {
            fileName: file.originalname,
            data: JSON.parse(file.buffer.toString('utf8')),
        }

        this.emit(EventTypes.receiveShowFile, showfile);
    }

    handleControlPost(req, res) {
        res.sendStatus(200);
        let data = req.body;
        if (data !== undefined) {
            if (data.type === "SOFT_RESET") {
                this.emit(EventTypes.controlAction, "SOFT_RESET");
            }
  
            if (data.type === "HARD_RESET") {
                Reboot();
            }
            
            if (data.type === "POWER_OFF") {
                PowerOff();
            }

        }
    }

    setElectronLogFilePath(filePath) {
        this.electronLogFilePath = filePath;
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

    handleLogsRequest(req, res) {
        if (this.electronLogFilePath === "") {
            res.json({ logs: "Error: Data could not be retrieved. electronLogFilePath has not been set" });
            return;
        }

        jetpack.readAsync(this.electronLogFilePath, "utf8").then( result => {
            res.json({ logs: result });
        }).catch( error => {
            res.json({ logs: error });
        })
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

function PowerOff() {
    if (os.platform() === "linux") {
        exec('poweroff');
    }
}

function Reboot() {
    if (os.platform() === "linux") {
        exec('reboot');
    }
}


module.exports = Server;