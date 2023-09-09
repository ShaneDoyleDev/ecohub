mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FsbHVtZGVubmlzaWUiLCJhIjoiY2xrM3gyNmtrMDZsMzNvcnlkcDA1OGlyNSJ9.JPGtfXiSJF5qipCkDbQuyg";

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        title: "Megs Bakery",
        message: "123 Smithy street",
        iconSize: [60, 60],
        filename: "office_1",
        filetype: "glb",
      },
      geometry: {
        type: "Point",
        coordinates: [-6.260278, 53.341389],
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Money Bank",
        message: "London",
        iconSize: [60, 60],
        filename: "office_2",
        filetype: "glb",
      },
      geometry: {
        type: "Point",
        coordinates: [-0.02085, 51.50519],
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Toot Toot Delivery",
        message: "Glasgow",
        iconSize: [60, 60],
        filename: "office_3",
        filetype: "glb",
      },
      geometry: {
        type: "Point",
        coordinates: [-4.251433, 55.860916],
      },
    },
  ],
};

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  zoom: 1.5,
  center: [30, 50],
  projection: "globe",
  antialias: true,
});

const tb = (window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
  defaultLights: true,
}));

map.on("style.load", () => {
  map.setFog({});

  for (const marker of geojson.features) {
    obj_filename = `assets/models/${marker.properties.filename}.${marker.properties.filetype}`;
    console.log(obj_filename);

    const el = document.createElement("div");
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = "marker";
    el.style.backgroundImage = `url(assets/images/pin.svg)`;
    el.style.backgroundColor = `#FEBC5B`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";

    el.addEventListener("click", () => {
      console.log($("#exampleModal"))
      $("#exampleModal").modal("toggle");
      $("#exampleModalLabel").html(marker.properties.title);
      $("#modalText").html(marker.properties.message);
    });

    // Add markers to the map.
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);

    map.addLayer({
      id: obj_filename,
      type: "custom",
      renderingMode: "3d",
      onAdd: function () {
        const scale = 1;
        const options = {
          obj: obj_filename,
          type: `${marker.properties.filetype}`,
          scale: { x: scale, y: scale, z: scale },
          units: "meters",
          rotation: { x: 90, y: -90, z: 0 },
        };

        tb.loadObj(options, (model) => {
          model.setCoords(marker.geometry.coordinates);
          model.setRotation({ x: 0, y: 0, z: 241 });
          tb.add(model);
        });
      },

      render: function () {
        tb.update();
      },
    });
  }
});
