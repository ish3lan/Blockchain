/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
// Importing the module 'level'
const level = require('level');
// Declaring the folder path that store the data
const chainDB = './chaindata';
// Declaring a class
class LevelSandbox {
  // Declaring the class constructor
  constructor() {
    this.db = level(chainDB);
  }
  
    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
      let self = this; 
      return new Promise(function(resolve, reject) {
        self.db.get(key)
        .then( (value) => {
          resolve(JSON.parse(value));
        },
        ( err) => {
          if(err){
            if (err.type == 'NotFoundError') {
              reject(err);
            }else {
              reject(err);
            }
          }
        });
      });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.db.put(key, JSON.stringify(value), function(err) {
          if (err) {
            console.log('Block ' + key + ' submission failed', err);
            reject(err);
          }
          console.log(value);
          resolve(value);
        });
      });
    }

    /**
     * Step 2. Implement the getBlocksCount() method
     */
     getBlocksCount() {
      let self = this;
      var block_count = 0;
      return new Promise(function(resolve, reject){
        self.db.createReadStream()
        .on('data', function (data) {
          // console.log("DATA HEIGHT ::: !!!!");
          // console.log(data);
          
          block_count++;
          // console.log("block count :  " , block_count);
        })
        .on('error', function (err) {
          reject(err)
        })
        .on('close', function () {
          // console.log("got close event in get Blocks Count");
          // console.log(block_count);
          resolve(block_count );

        });
      });

    }
  }

// Export the class
module.exports.LevelSandbox = LevelSandbox;