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

// TODO:
// * CLEAN the code
// * DOCUMENT what i am doing
// * READ substack's mesh code and diff with mine
// * USE hyperdiscovery instead

// HYPERDB ISSUES:
// * peer has been authorized but the db changes do not propagate from the authorized peer to the og creator's db
// * constant connection events from a single peer that has joined
// * when on same computer but in different folders, and with an authorized peer, and after having written once and then
//   restarted the node process i get: 
//   "Error: Another hypercore is stored here"
//
function setupSwarm(db) {
    var dbstr = db.key.toString("hex")
    var swarm = discovery(swarmDefaults({
        id: dbstr,
        stream: function(peer) {
            console.log("swarm.stream peer")
            return db.replicate({ // TODO: figure out what this truly does
                live: true,
                userData: db.local.key
            }) 
        }
    }))
    console.log("swarm key", dbstr)
    swarm.join(dbstr)
    swarm.on("connection", (peer) => {
        if (!peer.remoteUserData) {
            console.log("peer missing user data")
            return
        }
        console.log(peer.remoteUserData)
        console.log(peer.remoteUserData.toString("hex"))
        try { var key = Buffer.from(peer.remoteUserData) }
        catch (err) { console.error(err); return }
        db.authorized(key, function (err, auth) {
            console.log(key.toString("hex"), "authorized: " + auth)
            if (err) return console.log(err)
            if (!auth) db.authorize(key, function (err) {
                if (err) return console.log(err)
            })
        })
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

