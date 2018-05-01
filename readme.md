# hyperdb-examples
a small example on how to get up and running with [hyperdb](https://github.com/mafintosh/hyperdb) 

#### `npm install && node index.js --db db1`
then in another terminal window, using the key that is printed under `db key is` write   
`node index.js --db db2 --key <key>` where `<key>` is the key that was printed above


### commands
there's a small cli for interacting with the hyperdb. use it as follows

#### `.db` print out the db key
#### `.local` print out the local feed's key
#### `.get <key>` print out the information stored at `key`
#### `.put <key>=<value>` store `value` under `key` in the database
#### `.registered <key>` check if `key` is authorized to write to the database
#### `.auth <key>` authorize `key` to write to the database
