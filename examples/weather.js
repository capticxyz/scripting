class SampleElement extends CapElement {
  schema = {};
  init() {
    this.state = {
      count: 0,
      toggle: false,
    };
    document.body.addEventListener("connected", this.connected, {
      once: true,
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
  }

  showPosition = (data) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://www.7timer.info/bin/api.pl?lon=" +
        data.coords.longitude +
        "&lat=" +
        data.coords.latitude +
        "&product=civillight&output=json",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        this.showWeather(JSON.parse(result).dataseries);
      })
      .catch((error) => console.log("error", error));
  };

  showWeather = (dataseries) => {
    let x = 0;
    Object.keys(dataseries).forEach((key) => {
      x = x + 1.1;
      const day = dataseries[key].date % 100;
      const month = Math.floor((dataseries[key].date % 10000) / 100);
      const year = Math.floor(dataseries[key].date / 10000);
      const idate = new Date(year, month - 1, day);

      const iday = idate.toLocaleString(window.navigator.language, {
        weekday: "long",
      });
      const temp = dataseries[key].temp2m;
      const weather = dataseries[key].weather;

      const entity = document.createElement("a-entity");
      entity.object3D.position.set(x - 1.2, 1.3, 0);

      const itemIdate = document.createElement("a-entity");
      itemIdate.setAttribute("troika-text", {
        color: "#fff",
        align: "left",
        fontSize: 0.1,
        value: idate.toLocaleDateString(),
        fillOpacity: "0.6",
      });
      itemIdate.object3D.position.set(0, 0, 0);
      entity.appendChild(itemIdate);

      const itemIday = document.createElement("a-entity");
      itemIday.setAttribute("troika-text", {
        color: "#fff",
        align: "left",
        fontSize: 0.2,
        value: iday,
        fillOpacity: "1",
      });
      itemIday.object3D.position.set(0, 0.2, 0);
      entity.appendChild(itemIday);

      const itemTempMax = document.createElement("a-entity");
      itemTempMax.setAttribute("troika-text", {
        color: "#fff",
        align: "left",
        fontSize: 0.2,
        value: temp.max.toString(),
        fillOpacity: "1",
      });
      itemTempMax.object3D.position.set(0, -0.4, 0);
      entity.appendChild(itemTempMax);

      const itemTempMin = document.createElement("a-entity");
      itemTempMin.setAttribute("troika-text", {
        color: "#fff",
        align: "left",
        fontSize: 0.2,
        value: temp.min.toString(),
        fillOpacity: "0.6",
      });
      itemTempMin.object3D.position.set(0.2, -0.7, 0);
      entity.appendChild(itemTempMin);

      const itemWeather = document.createElement("a-entity");
      itemWeather.setAttribute("troika-text", {
        color: "#fff",
        align: "left",
        fontSize: 0.2,
        value: weather,
        fillOpacity: "0.5",
      });
      itemWeather.object3D.position.set(0, -0.9, 0);
      entity.appendChild(itemWeather);

      this.el.appendChild(entity);
    });
  };

  connected = () => {
    console.info("connected");
  };

  render() {
    const { count } = this.state;

    return html``;
  }
}

export default SampleElement;
