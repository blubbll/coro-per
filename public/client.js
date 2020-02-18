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

//rejoin eventSource on disconnect
const rejoiner = setInterval(() => {
  const rejoin = () => join(true);
  evtSource.readyState === EventSource.CLOSED
    ? [console.warn("No connection, rejoining..."), rejoin()]
    : console.debug(
        `Connection ${evtSource.readyState === 0 ? "waiting..." : "ok :)"}`
      );
}, 9999);

//initiali data fetch
fetch("/init")
  .then(res => res.json())
  .then(json => applyData(json));

//hazward svg by iconmonstr to prevent unicode turning to emoji
const haz = `<svg id="haz" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.254 9.804c1.433-3.5-.412-7.595-4.21-8.79l-.012.442c2.58 1.174 3.542 4.242 2.165 6.627-1.311 2.271-4.241 3.064-6.547 1.775-2.306-1.29-3.113-4.176-1.803-6.446.514-.89 1.278-1.553 2.155-1.952l-.001-.46c-1.578.481-2.98 1.533-3.861 3.058-1.054 1.826-1.131 3.936-.396 5.746-3.754.545-6.411 4.123-5.597 7.935l.396-.209c-.238-2.788 1.997-5.127 4.783-5.127 2.652 0 4.802 2.117 4.802 4.727 0 2.611-2.149 4.728-4.802 4.728-1.04 0-2.002-.327-2.788-.88l-.406.229c1.206 1.111 2.827 1.793 4.609 1.793 2.127 0 4.023-.971 5.259-2.486 1.235 1.515 3.132 2.486 5.259 2.486 1.783 0 3.403-.682 4.608-1.794l-.406-.229c-.786.553-1.748.88-2.788.88-2.652 0-4.802-2.117-4.802-4.728 0-2.61 2.149-4.727 4.802-4.727 2.787 0 5.021 2.339 4.783 5.127l.396.209c.816-3.812-1.843-7.39-5.598-7.934zm-6.254 5.021c-.828 0-1.5-.661-1.5-1.477 0-.815.672-1.477 1.5-1.477s1.5.661 1.5 1.477c0 .816-.672 1.477-1.5 1.477zm0-7.145c-.591 0-1.16.091-1.695.258-.548-.414-.937-1.016-1.059-1.713.856-.327 1.782-.514 2.754-.514s1.898.187 2.754.514c-.122.697-.511 1.299-1.059 1.713-.535-.167-1.104-.258-1.695-.258zm-3.888 9.53c-.022.739-.336 1.405-.837 1.888-1.438-1.122-2.452-2.741-2.779-4.591.671-.205 1.335-.201 2.085.174.273.977.809 1.846 1.531 2.529zm8.609 1.892c-.502-.482-.816-1.147-.841-1.884.729-.685 1.268-1.559 1.541-2.542.741-.37 1.407-.375 2.083-.167-.328 1.852-1.345 3.471-2.783 4.593z"/></svg>`;

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
  ).innerHTML = `${perc}%<br/><span class="small">(${haz}&#8202;${count.infected} of ${ppl} people)</span>`;
};

//update ppl count
const updateLocal = setInterval(() => applyData(window.count), 1399);

//PLAY
const pla = setInterval(() => {
  document.hasFocus() && clearInterval(pla) && $("audio").play();
}, 999);

["click", "wheel", "mousemove"].forEach(evt =>
  document.body.addEventListener(evt, () => $("audio").play(), false)
);
