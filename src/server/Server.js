const EventEmitter = require('events');
const express = require('express');
const bodyParser = require('body-parser');
const EventTypes = require('./EventTypes');
const App = express();
const Router = express.Router();
const Port = 8081;



class Server extends EventEmitter {
    constructor() {
        super();

        // Method Bindings.
        this.handleRootRequest = this.handleRootRequest.bind(this);
        this.handleDataRequest = this.handleDataRequest.bind(this);
        this.handleDataPost = this.handleDataPost.bind(this);

        // Server Setup.
        App.use(bodyParser.urlencoded({ extended: true }));
        App.use(bodyParser.json());

        Router.get('/', this.handleRootRequest);
        Router.get('/data', this.handleDataRequest);
        Router.post('/data', this.handleDataPost);

        App.use(Router);

        App.listen(Port);

        console.log("Server is listening on Port " + Port);
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
        res.json({ message: 'hooray! welcome to our api!' });

        this.emit(EventTypes.connectionReceived);
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