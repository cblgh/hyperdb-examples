var hyperdb = require("hyperdb")
var discovery = require("discovery-swarm")
var swarmDefaults = require("datland-swarm-defaults")
var readInput = require("./input.js")
var minimist = require("minimist")

var args = minimist(process.argv.slice(2))

if (!args.db) {
    console.error("error: need --db flag!\nexamples:\n\tnode index.js --db <your-new-db-file>\n\tnode index.js --db my.db")
    return
}

var disableAutoAuth = args.noautoauth ? true : false
console.log("auto authorization is:", disableAutoAuth ? "off" : "on")

// check if args.key was provided in the cli using --key
var db = args.key ? 
    // join an existing hyperdb where args.key comes from providing index.js with --key <key>
    hyperdb(args.db, args.key, { valueEncoding: "utf-8", reduce: (a, b) => a }) :
    // or create a new original hyperdb, by not specifying a key
    hyperdb(args.db, { valueEncoding: "utf-8", reduce: (a, b) => a })

db.on("ready", function() {
    console.log("db ready!\ndb key is\n\t", db.key.toString("hex"))
    console.log("local key is\n\t", db.local.key.toString("hex"))
    readInput(db)
    var swarm = setupSwarm(db)
})

// join a discovery swarm, connecting this hyperdb instance with others over DHT & DNS
// this step is essential to have your database changes propagate between your db and that of others
function setupSwarm(db) {
    var dbstr = db.key.toString("hex")
    var swarm = discovery(swarmDefaults({
        id: dbstr,
        stream: function(peer) {
            return db.replicate({ // TODO: figure out what this truly does
                live: true,
                userData: db.local.key
            }) 
        }
    }))
    console.log("looking for peers using swarm id\n\t", dbstr)

    swarm.join(dbstr)

    // emitted when a new peer joins 
    swarm.on("connection", (peer) => {
        if (!disableAutoAuth) {
            // initiate auto-authorization: 
            // use the local key from the peer, stored in their userData, to authenticate them automatically
            // (thanks substack && JimmyBoh https://github.com/karissa/hyperdiscovery/pull/12#pullrequestreview-95597621 )
            if (!peer.remoteUserData) {
                console.log("peer missing user data")
                return
            }
            try { var remotePeerKey = Buffer.from(peer.remoteUserData) }
            catch (err) { console.error(err); return }

            db.authorized(remotePeerKey, function (err, auth) {
                console.log(remotePeerKey.toString("hex"), "authorized? " + auth)
                if (err) return console.log(err)
                if (!auth) db.authorize(remotePeerKey, function (err) {
                    if (err) return console.log(err)
                    console.log(remotePeerKey.toString("hex"), "was just authorized!")
                })
            })
        }
        // return the swarm instance
        return swarm
    })
}
