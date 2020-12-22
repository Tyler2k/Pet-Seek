import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {

    constructor(
        private http: HttpClient,
    ) { }

    private static secret = 'nQSQ8hxPMlurtt0re0ik7Y4mo4TwD3RrepRUoakD';
    private static petFinderUrl: string = "https://api.petfinder.com/v2";
    private static key = 'NFVa3Wl23OkKaZpLHQHXfJRUYkXv5Rg0rgphpT2IvfUc31jMpW';
    private static token: string;

    getHeader() {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
        }
        return httpOptions;
    }

    getAuthorization() {
        const params = {
            grant_type: 'client_credentials',
            client_id: AuthenticationService.key,
            client_secret: AuthenticationService.secret
        }
        return this.http.post(AuthenticationService.petFinderUrl + `/oauth2/token`, JSON.stringify(params), this.getHeader())
            .pipe(map(r => {
                this.setToken(r['access_token'])
            }));
    }

    getToken() {
        return AuthenticationService.token;
    }

    setToken(token: string) {
        AuthenticationService.token = token;
    }

}