const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let { applyData } = window;

/* EVENTSOURCE */
let evtSource = (window.evtSource = {});
const join = force => {
  force && evtSource.close();
  evtSource = new EventSource(`./events`);

  evtSource.addEventListener(
    "event",
    evt => {
      const payload = JSON.parse(evt.data);
      const DATA = payload.data;

      switch (payload.type) {
        case "infected-update":
          {
            applyData(DATA);
          }
          break;
      }
    },
    false
  );
};
join();

fetch("/init")
  .then(res => res.json())
  .then(json => applyData(json));

applyData = count => {
  /////// ppl count by https://world-statistics.org/
  var d1 = new Date().getTime();
  var d0 = new Date(2019, 6, 1, 0, 0, 0, 0).getTime();
  var d2 = new Date(2020, 6, 1, 0, 0, 0, 0).getTime();
  var ppl = Math.round(7713468100 + ((d1 - d0) * 81330639) / (d2 - d0));
  ///////

  //calc percentage of total infected ppl
  const perc = (count.infected * 100) / ppl;

  //update window count on real update only
  count !== window.count && [
    console.debug(`${new Date()}: updated count`, count),
    (window.count = count)
  ];
  $(
    "#infected"
  ).innerHTML = `${perc}%<br/><span class="small">(${count.infected} of ${ppl} people)</span>`;
};

const updateLocal = setInterval(() => applyData(window.count), 1399);

const rejoiner = setInterval(() => {
  const rejoin = () => join(true);
  evtSource.readyState === EventSource.CLOSED
    ? [console.warn("No connection, rejoining..."), rejoin()]
    : console.debug(
        `Connection ${evtSource.readyState === 0 ? "waiting..." : "ok :)"}`
      );
}, 9999);
