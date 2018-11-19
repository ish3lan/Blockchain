# Project Title

This project is to serve the private blockchain created in project 2 using Nodejs

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites


```node```
```expressjs```
```npm i```


## Running the tests

```
 rm -R chaindata ;node BlockchainApp.js  
 ```

 the block chain will populate itself with 3 blocks



to add block use `block` endpoint to post your block. 
e.g.
```localhost:8000/api/block/```
body:
```
{
    "body": "Test Data #6",
    "time": "1542258543"
}
```
result:
```
{
    "body": "Test Data #6",
    "time": "1542440938",
    "previousBlockHash": "a36dc07d7027a14726503116cffa3062976bc3735eddbc49593dd9ca39543348",
    "height": 6,
    "hash": "5ac5c78562948b2075507a9d9a79dbb8e9fc6626f82721d22152a390c63da362"
}
```

also to get a block:

get request:
```localhost:8000/api/block/5```
and result:
```
{
    "body": "Test Data #5",
    "time": "1542440935",
    "previousBlockHash": "747d311d967ca3748aec4fc5d90a0c3164d89514e40ef524ad845d44c1db12d8",
    "height": 5,
    "hash": "a36dc07d7027a14726503116cffa3062976bc3735eddbc49593dd9ca39543348"
}
```




## Authors

* **Mohammed Al Shaalan** - [Mohammed Alshaalan](https://github.com/ish3lan)

## Acknowledgments

* Udacity