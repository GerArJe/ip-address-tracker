import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { IpifyService } from '../services/ipify.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  map;
  geolocationObject;
  title = 'IP Address Tracker';
  placeholder = 'Search for any IP address or domain';
  searchText: any = '';
  loading = false;
  markerIcon;
  points: any[] = [];

  constructor(private ipifyService: IpifyService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  /* initialize map */
  async initMap(): Promise<void> {
    try {
      this.geolocationObject = await this.ipifyService
        .getGeolocationObject()
        .toPromise();
    } catch (error) {}
    this.loading = false;

    if (this.geolocationObject) {
      //initialize
      this.map = L.map('map').setView(
        [
          this.geolocationObject.location.lat,
          this.geolocationObject.location.lng,
        ],
        20
      );

      //title layer
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
        }
      ).addTo(this.map);

      /* custom marker icon */
      this.markerIcon = L.icon({
        iconUrl: '/assets/images/icon-location.svg',
        iconSize: [46, 56], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      });

      // marker
      var point = L.marker(
        [
          this.geolocationObject.location.lat,
          this.geolocationObject.location.lng,
        ],
        { icon: this.markerIcon }
      ).addTo(this.map);
      this.points.push(point);
    }
  }

  async search() {
    this.loading = true;
    this.geolocationObject = null;

    /* verify if it is an IP o a domain a search new data */
    var myRe = new RegExp(
      '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    );
    if (this.searchText.search(myRe) === -1) {
      try {
        this.geolocationObject = await this.ipifyService
          .getGeolocationObjectByDomain(this.searchText)
          .toPromise();
      } catch (error) {}
    } else {
      try {
        this.geolocationObject = await this.ipifyService
          .getGeolocationObjectByIP(this.searchText)
          .toPromise();
      } catch (error) {}
    }

    /* clean marker */
    for (let i = 0; i < this.points.length; i++) {
      this.map.removeLayer(this.points[i]);
    }
    this.points = [];

    this.loading = false;

    /* change map position */
    this.map.flyTo(
      [
        this.geolocationObject.location.lat,
        this.geolocationObject.location.lng,
      ],
      18
    );
    // marker
    L.marker(
      [
        this.geolocationObject.location.lat,
        this.geolocationObject.location.lng,
      ],
      { icon: this.markerIcon }
    ).addTo(this.map);
  }
}
