import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  mapLoadedEvent (status: boolean) {
    console.log('The map loaded: ' + status);
  }
}
