const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockchainClass = require('./Blockchain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
 class BlockchainController {

    /**
     * Constructor to create a new BlockchainController, you need to initialize here all your endpoints
     * @param {*} app 
     */
     constructor(app) {
      this.app = app;
      this.blockchain = new BlockchainClass.Blockchain();;
      this.initializeMockData();
      this.getBlockByHeight();
      this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
     getBlockByHeight() {
      var self = this;
      this.app.get("/block/:index", (req, res) => {
        let index = parseInt(req.params.index);
        console.log(index);
        self.blockchain.getBlock(index)
        .then((block)=>{
          console.log(block);
          console.log("Got True");
          res.set('Content-Type','application/json')
          res.send(JSON.stringify(block));
          res.end();
          return;
        },(error)=>{
          console.log("No result in getBlockByHeight")
          res.status(404).end(JSON.stringify({'error':'No blocks with the provided height'}));
          return;
        });

          });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
     postNewBlock() {
      var self = this;
      this.app.post("/block", (req, res) => {
        console.log("req: ");
        console.log(req.body.body);
        if (!req.body.body){
          res.status(400).end(JSON.stringify({'error':'could not post, make sure you have valid block in request body'}));
          return;
       }
       self.blockchain.addBlock(req.body).then(()=>{
        res.set('Content-Type','application/json');
        res.status(200).send(JSON.stringify(req.body));
        res.end();
      });


     });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
     initializeMockData() {
      var self = this;
      this.blockchain.addBlock(new BlockClass.Block('Test 1'))
      .then(()=>{
        self.blockchain.addBlock(new BlockClass.Block('Test 2'))
        .then(()=>{
          self.blockchain.addBlock(new BlockClass.Block('Test 3'))
          .then(()=>{
            return;
          });
        });    
      });
    }

  }

/**
 * Exporting the BlockchainController class
 * @param {*} app 
 */
 module.exports = (app) => { return new BlockchainController(app);}