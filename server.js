//
const //imports
  express = require("express"),
  app = express(),
  EventEmitter = require("eventemitter3"),
  fetch = require("node-fetch"),
  cheerio = require("cheerio");

//config emitter
const emitter = new EventEmitter();

app.get("/events", (req, res) => {
  console.log("New client");
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  // Heartbeat
  const nln = () => {
    res.write("\n");
  };
  const hbt = setInterval(nln, 15000);

  const onEvent = data => {
    res.write("retry: 500\n");
    res.write(`event: event\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on("event", onEvent);

  // Clear heartbeat and listener
  req.on("close", () => {
    console.log("Client disconnected");
    clearInterval(hbt);
    emitter.removeListener("event", onEvent);
  });
});

app.get("/init", (req, res) => {
  res.json(count);
});

const count = {
  infected: 0,
  dead: 0,
  recovered: 0,
  fresh: true
};

const getCount = () => {
  const oldCount = count;
  fetch("https://www.worldometers.info/coronavirus/")
    .then(res => res.text())
    .then(raw => {
      const $ = cheerio.load(raw);

      let i = 0;
      for (const valRaw of Array.from($(".maincounter-number").children())) {
        i++;
        const val = valRaw.children[0].data.replace(/[^\d]/gi, "").trim();
        switch (i) {
          case 1:
            count.infected = val;
            break;
          case 2:
            count.dead = val;
            break;
          case 3:
            count.recovered = val;
            break;
        }
      }

      //push updated count to clients
      count !== oldCount &&
        emitter.emit("event", {
          type: "infected-update",
          data: count
        });
    });
};

/*
//debug, delete me maybe
let i = 0;
setInterval(() => {
  count.dead = i;
  i++;
  emitter.emit("event", {
    type: "infected-update",
    data: count
  });
}, 999);
*/

//first init of data
setTimeout(getCount);

//interval to fetch infected-data from host
const intervalMinutes = 30;

setInterval(getCount, 60 * 1000 * intervalMinutes);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
