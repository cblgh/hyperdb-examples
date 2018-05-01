# hyperdb-examples
a small example on how to get up and running with [hyperdb](https://github.com/mafintosh/hyperdb) 

#### `npm install && node index.js --db db1`
then in another terminal window, using the key that is printed under `db key is`, write   
#### `node index.js --db db2 --key <key>` 
where `<key>` is the key that was printed above


## Commands
there's a small cli (see [input.js](https://github.com/cblgh/hyperdb-examples/blob/master/input.js)) for interacting with the hyperdb. use it as follows

#### `.db`   
&nbsp;&nbsp;&nbsp;&nbsp;print out the db key
#### `.local`   
&nbsp;&nbsp;&nbsp;&nbsp;print out the local feed's key
#### `.get <key>`   
&nbsp;&nbsp;&nbsp;&nbsp;print out the information stored at `key`  
&nbsp;&nbsp;&nbsp;&nbsp;`.get hello` 
#### `.put <key>=<value>`   
&nbsp;&nbsp;&nbsp;&nbsp;store `value` under `key` in the database  
&nbsp;&nbsp;&nbsp;&nbsp;`.put hello=world`
#### `.registered <key>`   
&nbsp;&nbsp;&nbsp;&nbsp;check if `key` is authorized to write to the database
#### `.auth <key>`   
&nbsp;&nbsp;&nbsp;&nbsp;authorize `key` to write to the database

## References
* [mafintosh/hyperdb](https://github.com/mafintosh/hyperdb) dat's distributed scalable database, see the full api
* [jimpick/dat-shopping-list](https://github.com/jimpick/dat-shopping-list) an interactive web demo using hyperdb by way of [hyperdrive#hyperdb-backend](https://github.com/mafintosh/hyperdrive/tree/hyperdb-backend)
* [substack/chatmesh](https://github.com/substack/chatmesh/) a cli chat client built on hyperdb
