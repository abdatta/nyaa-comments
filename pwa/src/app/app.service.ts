import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NyaaComment } from '../../../src/types';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  fetchComments(nyaaId?: string): Promise<NyaaComment[]> {
    return this.httpClient.get<NyaaComment[]>('/api/comments', { params: nyaaId ? { nyaaId } : {}}).toPromise();
  }

  saveSubscription(sub: PushSubscription) {
    return this.httpClient.post('/api/subscriptions', { sub }).toPromise();
  }
}
