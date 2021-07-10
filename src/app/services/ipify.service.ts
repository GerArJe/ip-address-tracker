import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IpifyService {
  constructor(private httpClient: HttpClient) {}

  getGeolocationObject() {
    return this.httpClient
      .get(
        'https://geo.ipify.org/api/v1?apiKey=at_UBJuu3Ug9i79mdBXzLWjGzVSZ7t9t&'
      )
      .pipe(map((res) => res as any));
  }

  getGeolocationObjectByIP(ipAddress: string) {
    return this.httpClient
      .get(
        'https://geo.ipify.org/api/v1?apiKey=at_UBJuu3Ug9i79mdBXzLWjGzVSZ7t9t&ipAddress=' +
          ipAddress
      )
      .pipe(map((res) => res as any));
  }

  getGeolocationObjectByDomain(domain: string) {
    return this.httpClient
      .get(
        'https://geo.ipify.org/api/v1?apiKey=at_UBJuu3Ug9i79mdBXzLWjGzVSZ7t9t&domain=' +
          domain
      )
      .pipe(map((res) => res as any));
  }
}
