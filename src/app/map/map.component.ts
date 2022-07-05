import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Input} from '@angular/core';
import { ILoadScriptOptions, loadCss, loadModules } from 'esri-loader';
import { MapPoint } from '../models/mapPoint.model';
import esri = __esri;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();
  @Output() mapClickEvent = new EventEmitter<esri.ViewClickEvent>();

  @Input("currentCoordinates")
  set currentCoordinates(currentCoordinates: MapPoint) {
    this.showPoint(currentCoordinates.longitude, currentCoordinates.latitude).then(() => {
      console.log("Current Coordinates Changed", currentCoordinates);
    });
  }

  @ViewChild("mapViewNode", { static: true }) private mapViewElement!: ElementRef;

  //Map properties
  private basemap: string = "arcgis-navigation";
  private center: Array<number> = [15.97899, 45.80026]; //Longitude, latitude
  private zoom: number = 12;

  private loaded: boolean = false;

  private mapView: esri.MapView | null = null;
  private graphicsLayer: esri.GraphicsLayer | null = null;

  constructor() { }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap()
      .then(mapView => {
        this.mapView = mapView;
        // The map has been initialized
        console.log("mapView ready: ", this.mapView.ready);
        this.loaded = this.mapView.ready;
      }).catch(error => {
        this.loaded = false;
      }).finally(() => {
        this.mapLoadedEvent.emit(this.loaded);
      });
  }

  async initializeMap(): Promise<esri.MapView> {
    try {
      const jsArcgisUrl = "https://js.arcgis.com/4.24/";
      const cssArcgisUrl = `${jsArcgisUrl}esri/themes/light/main.css`;
      const loadOptions: ILoadScriptOptions = {
        url: jsArcgisUrl,
      };

      // Load the CSS for the ArcGIS API for JavaScript
      loadCss(cssArcgisUrl);

      // Load the modules for the ArcGIS API for JavaScript
      const [
        EsriConfig,
        EsriMap,
        EsriMapView,
        EsriWidgetSearch,
        GraphicsLayer
      ] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Search",
        "esri/layers/GraphicsLayer"
      ], loadOptions);

      EsriConfig.apiKey = "AAPKb494dde343ea44b59aa1fe40a6691914sM8gWhu0aqj5b6Mxm5DtMIzjrj7f_TPDTGHP5tjJo3rNiuDwkOBvUAiBQxuvUWE1";

      // Initialize the Map
      const mapProperties: esri.MapProperties = {
        basemap: this.basemap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewElement.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: map
      };

      const mapView: esri.MapView = new EsriMapView(mapViewProperties);

      mapView.on("click", this.mapViewClick.bind(this));

      const graphicsLayer: esri.GraphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      this.graphicsLayer = graphicsLayer;

      // Initialize the Search Widget
      const searchProperties: esri.widgetsSearchProperties = {
        view: mapView
      }
      const search: esri.widgetsSearch = new EsriWidgetSearch(searchProperties);

      mapView.ui.add(search, "top-right");

      await mapView.when();

      return mapView;
    } catch (error) {
      console.log("EsriLoader: ", error);

      throw (error);
    }
  }

  async mapViewClick(event: esri.ViewClickEvent) {
    this.mapClickEvent.emit(event);
    await this.showPoint(event.mapPoint.longitude, event.mapPoint.latitude);
  }

  async showPoint(longitude: number, latitude: number) {

    const jsArcgisUrl = "https://js.arcgis.com/4.24/";
    const loadOptions: ILoadScriptOptions = {
      url: jsArcgisUrl,
    };

    const [
      Graphic,
    ] = await loadModules([
      "esri/Graphic",
    ], loadOptions);

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1
      }
    };
    //Create a point
    const point = {
      type: "point",
      longitude: longitude,
      latitude: latitude
    };

    //Renders point
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
    });
    this.graphicsLayer?.removeAll();
    this.graphicsLayer?.add(pointGraphic);
  }
}
