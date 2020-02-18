const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let evtSource = (window.evtSource = {});
const join = force => {
  force && evtSource.close();
  evtSource = new EventSource(`./events`);
  evtSource.addEventListener(
    "data",
    evt => {
      const payload = JSON.parse(evt.data);
      const data = payload.data;
      switch (payload.type) {
        case "infected-update":
          {
            console.log(data);
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

const applyData = count => {
  ///////
  var d1 = new Date().getTime();
  var d0 = new Date(2019, 6, 1, 0, 0, 0, 0).getTime();
  var d2 = new Date(2020, 6, 1, 0, 0, 0, 0).getTime();
  var ppl = Math.round(7713468100 + ((d1 - d0) * 81330639) / (d2 - d0));
  ///////
  window.count = count;

  const perc = (count.infected * 100) / ppl;
  console.debug("updated count", count);
  $(
    "#infected"
  ).innerHTML = `${perc}%<br/><span class="small">(${count.infected} of ${ppl} people)</span>`;
};

const rejoiner = setInterval(() => {
  const rejoin = () => join(true);
  evtSource.readyState !== EventSource.OPEN
    ? [console.warn("No connection, rejoining..."), rejoin()]
    : console.debug("Connection ok :)");
}, 9999);