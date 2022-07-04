import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ILoadScriptOptions, loadCss, loadModules } from 'esri-loader';
import esri = __esri;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  @Output() onClickEvent = new EventEmitter<MouseEvent>();

  @ViewChild("mapViewNode", { static: true }) private mapViewElement!: ElementRef;

  private basemap: string = "arcgis-navigation";
  private center: Array<number> = [-40, 28];
  private zoom: number = 2;

  public handleClick(event: MouseEvent) {
    this.onClickEvent.emit(event);
  }

  private loaded: boolean = false;

  private mapView: esri.MapView | null = null;

  get mapLoaded(): boolean {
    return this.loaded;
  }

  constructor() { }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap()
      .then(mapView => {
        this.mapView = mapView;
        // The map has been initialized
        console.log("mapView ready: ", this.mapView.ready);
        this.loaded = this.mapView.ready;

        this.mapLoadedEvent.emit(true);
      });
  }

  ngOnDestroy() {
    if (this.mapView) {
      // Destroy the map view
      /*this.mapView.container = null;*/
    }
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

        EsriGraphic,

        EsriMap,
        EsriMapView,
        EsriLocator,
        EsriWidgetLocate,
        EsriWidgetSearch,
        EsriWidgetTrack,
        Graphic,
        GraphicsLayer
      ] = await loadModules([
        "esri/config",

        "esri/Graphic",

        "esri/Map",
        "esri/views/MapView",
        "esri/rest/locator",
        "esri/widgets/Locate",
        "esri/widgets/Search",
        "esri/widgets/Track",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
      ], loadOptions);

      EsriConfig.apiKey = "AAPKb494dde343ea44b59aa1fe40a6691914sM8gWhu0aqj5b6Mxm5DtMIzjrj7f_TPDTGHP5tjJo3rNiuDwkOBvUAiBQxuvUWE1";

      // Initialize the Graphic
      const simpleLineSymbolProperties: esri.SimpleLineSymbolProperties = {
        color: "#efefef",
        width: "1.5px"
      };
      const simpleMarkerSymbolProperties: esri.SimpleMarkerSymbolProperties = {
        color: "green",
        size: "12px",
        type: "simple-marker",
        outline: simpleLineSymbolProperties
      };

      const graphicProperties: esri.GraphicProperties = {
        symbol: simpleMarkerSymbolProperties
      };
      const graphic: esri.Graphic = new EsriGraphic(graphicProperties);

      // Initialize the Map
      const mapProperties: esri.MapProperties = {
        basemap: this.basemap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewElement.nativeElement,
        center: [15.97899, 45.80026], //Longitude, latitude
        zoom: 12,
        map: map
      };

      const mapView: esri.MapView = new EsriMapView(mapViewProperties);

      // Initialize the Locate Widget
      const locateProperties: esri.LocateProperties = {
        view: mapView,
        useHeadingEnabled: false,
        goToOverride: function (view, options) {
          options.target.scale = 1500;
          return view.goTo(options.target);
        }
      }

      const locate: esri.Locate = new EsriWidgetLocate(locateProperties);

      // Initialize the Search Widget
      const searchProperties: esri.widgetsSearchProperties = {
        view: mapView
      }

      const search: esri.widgetsSearch = new EsriWidgetSearch(searchProperties);

      //Create a point
      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const point = { 
        type: "point",
        longitude: 15.966568,
        latitude: 45.815399
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1
        }
      };
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });
      graphicsLayer.add(pointGraphic);

      // Initialize the Track Widget
      const trackProperties: esri.TrackProperties = {
        view: mapView,
        graphic: graphic,
        useHeadingEnabled: true,
      }

      const track: esri.Track = new EsriWidgetTrack(trackProperties);

      mapView.ui.add(locate, "top-left");
      mapView.ui.add(search, "top-right");
      mapView.ui.add(track, "top-left");

      await mapView.when();

      return mapView;
    } catch (error) {
      console.log("EsriLoader: ", error);

      throw (error);
    }
  }
}
