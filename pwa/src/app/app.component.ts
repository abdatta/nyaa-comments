import { Component, OnInit, HostListener } from '@angular/core';
import { AppService } from './app.service';
import { NyaaComment } from '../../../src/types';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PromptComponent } from './prompt.component';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <mat-card class="card" *ngFor="let comment of comments">
      <mat-card-header>
        <div mat-card-avatar [style.background-image]="'url(' + comment.avatar +')'" style="background-size: cover;"></div>
        <mat-card-title>{{ comment.user }}</mat-card-title>
        <mat-card-subtitle style="overflow-wrap: anywhere;">{{ comment.comment }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="content">
        <a href="https://nyaa.si/view/{{comment.nyaaId}}#{{comment.commentId}}" target="_blank">{{ comment.torrentName }}</a>
      </mat-card-content>
    </mat-card>
  </div>
  `,
  styles: [`
  a {color: cornflowerblue;}
  a:visited {color: cornflowerblue;}
  a:hover {color: cornflowerblue;}
  a:active {color: cornflowerblue;}

  .container {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  .card {
    width: 90%;
    max-width: 400px;
    margin: 10px;
  }

  .content {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  `]
})
export class AppComponent implements OnInit {
  comments: NyaaComment[] = [];
  private promptToClose = Promise.resolve();

  constructor(private service: AppService,
              private swPush: SwPush,
              private bottomSheet: MatBottomSheet,
              private deviceService: DeviceDetectorService) { }

  async ngOnInit() {
    this.comments = await this.service.fetchComments();
    await this.subscribeToNotifications();
  }

  async subscribeToNotifications() {
    if (Notification.permission === 'granted') { return; }
    await this.delay(5000);
    if (await this.prompt('Allow notifications')) {
      await this.swPush.requestSubscription({ serverPublicKey: environment.vapidKey })
        .then(sub => this.service.saveSubscription(sub))
        .catch(err => console.error('Could not subscribe to notifications', err));
    }
}

  @HostListener('window:beforeinstallprompt', ['$event'])
  async beforeInstallPrompt(event: Event & Window) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();

    // Open prompt if device is mobile
    if (this.deviceService.isMobile()) {
      if (await this.prompt('Add as an app')) {
        event.prompt();
      }
    }
  }

  async prompt(text: string): Promise<boolean> {
    await this.promptToClose;
    const bsRef = this.bottomSheet.open<PromptComponent, string, boolean>(PromptComponent, { disableClose: true, data: text });
    const response = bsRef.afterDismissed().toPromise();
    this.promptToClose = response.then(() => Promise.resolve());
    return response;
  }

  delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
}
