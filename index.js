var hyperdb = require("hyperdb")
var discovery = require("discovery-swarm")
var swarmDefaults = require("datland-swarm-defaults")
var readInput = require("./input.js")
var minimist = require("minimist")

var args = minimist(process.argv.slice(2))

var db = args.key ? 
    hyperdb(args.db, args.key, { valueEncoding: "utf-8", reduce: (a, b) => a }) :
    hyperdb(args.db, { valueEncoding: "utf-8", reduce: (a, b) => a })


db.on("ready", function() {
    console.log("db ready!!")
    readInput(db)
    var swarm = setupSwarm(db)
})

// LESSONS
// * pass the key as a string to hyperdb(<storage>, key)
// * connect to db.key, authorize using db.local.key
// * db.authorize / db.authorized doesn't accept a string as key; needs buffer

// TODO: implement small interface to
// * POST key, value
// * AUTORHIZE other peer
// * USE hyperdiscovery instead

// HYPERDB ISSUES:
// * peer has been authorized but the db changes do not propagate from the authorized peer to the og creator's db
// * constant connection events from a single peer that has joined
// * when on same computer but in different folders, and with an authorized peer, and after having written once and then
//   restarted the node process i get: 
//   "Error: Another hypercore is stored here"
//
function setupSwarm(db) {
    console.log(db.local.key.toString("hex"))
    var swarm = discovery(swarmDefaults({
        id: db.key.toString("hex"),
        stream: function(peer) {
            console.log("swarm.stream peer", peer)
            return db.replicate({live: true}) // TODO: figure out what this does
        }
    }))
    var key = db.key
    console.log("swarm key", key.toString("hex"))
    swarm.join(key.toString("hex"))
    swarm.on("connection", (peer) => {
        console.log("# peers: ", swarm.connected)
        console.log("new peer joined")
    })
    return swarm
}


db.put("/hello", "world", function (err) {
    if (err) throw err
    db.get("/hello", function (err, node) {
        if (err) throw err
        console.log("/hello --> " + node.value)
    })
})

