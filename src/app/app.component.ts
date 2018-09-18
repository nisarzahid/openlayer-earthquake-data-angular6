import { Component } from '@angular/core';
// import OlMap from 'ol/map';
// import OlXYZ from 'ol/source/xyz';
// import OlTileLayer from 'ol/layer/tile';
// import OlView from 'ol/view';
// // import OlProj from 'ol/proj';
// import * as OlProj from 'ol/proj';


import Map from 'ol/Map.js';
import View from 'ol/View.js';
import KML from 'ol/format/KML.js';
import Polygon from 'ol/geom/Polygon.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {toContext} from 'ol/render.js';
import Stamen from 'ol/source/Stamen.js';
import VectorSource from 'ol/source/Vector.js';
import {Fill, Icon, Stroke, Style} from 'ol/style.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  symbol = [[0, 0], [4, 2], [6, 0], [10, 5], [6, 3], [4, 5], [0, 0]];
  scale=1;
  scaleFunction = function(coordinate) {
    return [coordinate[0] * 1, coordinate[1] * 1];
  };

  styleCache = {};

  styleFunction = function(feature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it from
    // the Placemark's name instead.
    var name = feature.get('name');
    var magnitude = parseFloat(name.substr(2));
    var size = parseInt((10 + 40 * (magnitude - 5)).toString(), 10);
    this.scale = size / 10;
    var style = this.styleCache[size];
    if (!style) {
      var canvas = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'));
      var vectorContext = toContext(
        /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d')),
        {size: [size, size], pixelRatio: 1});
      vectorContext.setStyle(new Style({
        fill: new Fill({color: 'rgba(255, 153, 0, 0.4)'}),
        stroke: new Stroke({color: 'rgba(255, 204, 0, 0.2)', width: 2})
      }));
      vectorContext.drawGeometry(new Polygon([this.symbol.map(this.scaleFunction)]));
      style = new Style({
        image: new Icon({
          img: canvas,
          imgSize: [size, size],
          rotation: 1.2
        })
      });
      this.styleCache[size] = style;
    }
    return style;
  };


  constructor() {
  }

  ngOnInit() {

    var style = new Style({
      
    });
    var vector = new VectorLayer({
      source: new VectorSource({
        url: 'assets/data/kml/2012_Earthquakes_Mag5.kml',
        format: new KML({
          extractStyles: false
        })
      }),
     
        // fill: new Fill({color: 'rgba(255, 153, 0, 0.4)'}),
        // stroke: new Stroke({color: 'rgba(255, 204, 0, 0.2)', width: 2})
      
      //style: this.styleFunction
    });

    var raster = new TileLayer({
      source: new Stamen({
        layer: 'toner'
      })
    });

    var map = new Map({
      layers: [raster, vector],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    // setTimeout(() => {
    //   var source = vector.getSource();
    //   var features = source.getFeatures();
    //   console.log(features);
    //      // source.getFeatures()(function(feature) {'DO THE HIDING'})
    //      features.forEach(element => {
          
    //        element.setStyle(this.styleFunction(element));
    //      });
    // }, 10);
 

  //   var thing = new ol.geom.Polygon( [[
  //     ol.proj.transform([-16,-22], 'EPSG:4326', 'EPSG:3857'),
  //     ol.proj.transform([-44,-55], 'EPSG:4326', 'EPSG:3857'),
  //     ol.proj.transform([-88,75], 'EPSG:4326', 'EPSG:3857')
  // ]]);
  // var featurething = new ol.Feature({
  //     name: "Thing",
  //     geometry: thing
  // });
  // vectorSource.addFeature( featurething );

    // this.source = new OlXYZ({
    //   // Tiles from Mapbox (Light)
    //   url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    // });

 
  }

}
