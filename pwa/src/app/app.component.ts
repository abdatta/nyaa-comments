import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <mat-card class="card" *ngFor="let comment of comments">
      <mat-card-header>
        <div mat-card-avatar [style.background-image]="'url(' + comment.avatar +')'" style="background-size: cover;"></div>
        <mat-card-title>{{ comment.user }}</mat-card-title>
        <mat-card-subtitle>{{ comment.comment }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
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
  }`]
})

export class AppComponent {
  comments = []
}
