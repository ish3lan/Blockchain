
/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
var Promise = require('bluebird');
//Importing levelSandbox class
const LevelSandboxClass = require('./LevelSandbox.js');
const BlockClass = require('./Block.js');


// Creating the levelSandbox class object

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = new LevelSandboxClass.LevelSandbox();
    // this.addGenesusBlock().then(console.log);
  }

  addGenesusBlock(){
    // console.log("entered addGenesusBlock with new Block ");
    var newBlock = new BlockClass.Block("Genesus");
    newBlock.previousBlockHash = "0x0";
    newBlock.height =0;
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    var self = this;
    // console.log('before returning addGenesusBlock');
    return new Promise((resolve, reject) => {
      self.chain.addLevelDBData(newBlock.height, newBlock).then((result)=>{
        resolve(result);
      });
    });
  }


  // Add new block
  addBlock(newBlock){
    // console.log("entered addBlock with new Block " + JSON.stringify(newBlock));
    var self = this;
    var newBlock_self = newBlock;
    return new Promise ((resolve, reject)=> {
      self.get_last_block()
      .then((gotGenesusBlock)=>{
        // console.log('gotGenesusBlock');
        var last_block = gotGenesusBlock;
        var prev_hash = last_block.hash;
        var height = last_block.height;
        newBlock.previousBlockHash = prev_hash;
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        newBlock.height = height + 1;
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        self.chain.addLevelDBData(newBlock.height, newBlock)
        .then((value)=>{
          resolve(value);
        });
      },
      (noGenesusBlock)=>{
        // console.log('noGenesusBlock');
        self.addGenesusBlock().then((last_block)=>{
          var prev_hash = last_block.hash;
          var height = last_block.height;
          newBlock.previousBlockHash = prev_hash;
          newBlock.time = new Date().getTime().toString().slice(0,-3);
          newBlock.height = height+1;
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          self.chain.addLevelDBData(newBlock.height, newBlock)
          .then((value)=>{
            resolve(value);
          });
        });
      });

    });
  }

  get_last_block(){
    // console.log("entered get_last_block");

    let self = this;
    return new Promise((resolve, reject ) => {
      self.getBlockHeight()
      .then((height)=>
      {
        if (height === 0){
          reject("No Genesus Block");
        }else{
          self.getBlock(height-1)
          .then((value)=>{
            // console.log("Get last Block Resolves: " + JSON.stringify(value));
            resolve(value);
          });
        }
      });
    });
  }


  getBlock(key){
    let self = this; 
    return new Promise(function(resolve, reject) {
      self.chain.getLevelDBData(key).then(
        (value) => {
         console.log('getLevelDBData in getBlock : ', value );
         resolve(value);

       },(error)=>{
         if (error.type == 'NotFoundError') {
          console.log('NotFoundError');
          reject(error);
        }
        else {
          reject(error);
          console.log('else NotFoundError');
        }
      }
      );
    });
  }


  // Get block height
  getBlockHeight(){
    //console.log("Get Block Height Returns ");
    return new Promise((resolve, reject)=>{
      this.chain.getBlocksCount().then((count)=>{
        resolve(count);
      });
    });
  }


  validateBlock(blockHeight){
    let self = this;
    return new Promise((resolve, reject) =>{
      self.getBlock(blockHeight).then((block)=>{
        resolve(self.validateBlockObject(block));
      });
    });
  }


  validateBlockObject(block){
    let blockHash = block.hash;
    block.hash = '';
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    block.hash = blockHash;
    return blockHash === validBlockHash;
  }


  validateChain(){
    let self = this;
    var not_valid_blocks = [];
    var previous_block = null ;
    return new Promise(function(resolve, reject){
      self.chain.db.createReadStream()
      .on('data', function (data) {
        // console.log("GOT DATA in validate Chain!!!!");
        // console.log(data);
          // validateBlockObject(data, )
          var currentBlock = JSON.parse(data.value);
          if (self.validateBlockObject(currentBlock)){
            if (previous_block === null || currentBlock.previousBlockHash === previous_block.hash){
              console.log("block: ", currentBlock, " is valid.");
            }else{
              console.log("block with height : ", currentBlock.height, " is not valid as its previous block hash changed.");
              not_valid_blocks.push(currentBlock);
            }
          }else{
            console.log("block with height : ", currentBlock.height, " is not valid as it contnets changed.");
            not_valid_blocks.push(currentBlock)
          }
          previous_block = currentBlock;
        })
      .on('error', function (err) {
        reject(err)
      })
      .on('close', function () {
        console.log("Done validateChain");
        resolve(not_valid_blocks.length === 0);
      });
    });
  }
}

module.exports.Blockchain = Blockchain;


//testing
// var bc = new Blockchain();
// // console.log( "created block chain");
// // console.log('created nBlock : ' + JSON.stringify(nBlock));
// bc.addBlock(new BlockClass.Block('test1'))
// .then(()=>{
//   // console.log("Reached This Point");
//   bc.addBlock(new BlockClass.Block('test2'))
//   .then(()=>{
//     // console.log("Added Second Block");
//     bc.addBlock(new BlockClass.Block('test3'))
//     .then(()=>{
//       bc.getBlockHeight()
//       .then((height)=>{
//         bc.validateChain();
//       });
//     });
//   });    
// });

