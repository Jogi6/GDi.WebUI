import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ILoadScriptOptions, loadCss, loadModules, } from 'esri-loader';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public forecasts?: WeatherForecast[];

  constructor(http: HttpClient) {
    http.get<WeatherForecast[]>('/weatherforecast').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }

   ngOnInit() {
    const jsArcgisUrl = 'https://js.arcgis.com/4.24/';
    const cssArcgisUrl = `${jsArcgisUrl}esri/themes/light/main.css`;
    const loadOptions: ILoadScriptOptions = {
      url: jsArcgisUrl,
    };

    console.log("loadCss");
    loadCss(cssArcgisUrl);
    console.log("loadCss OK");

     console.log("loadModules");
     loadModules(['esri/config', 'esri/Map', 'esri/views/MapView'], loadOptions).then(([
       EsriConfig, EsriMap, EsriMapViw
     ]) => {
       EsriConfig.apiKey = "AAPKb494dde343ea44b59aa1fe40a6691914sM8gWhu0aqj5b6Mxm5DtMIzjrj7f_TPDTGHP5tjJo3rNiuDwkOBvUAiBQxuvUWE1";
       const map = new EsriMap({
         basemap: "arcgis-navigation"
       });

       const view = new EsriMapViw({
         map: map,
         container: "viewDiv",
         center: [-40, 28],
         zoom: 2
       });

    console.log("All Ok");
     });
  }

  title = 'GDi.WebUI';
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
