import { Component, OnInit } from '@angular/core';
import { Subreddit } from './../subreddit.model';
import { SubredditService } from './../subreddit.service';
import { Router } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-subreddits',
  templateUrl: './subreddits.component.html',
  styleUrls: ['./subreddits.component.css'],
  providers: [SubredditService]
})

export class SubredditsComponent implements OnInit {

  subreddits: FirebaseListObservable<any[]>;
  private user;

  constructor(
    private router: Router,
    private subredditService: SubredditService
  ) { }

  ngOnInit(): void {
    this.subreddits = this.subredditService.getSubreddits();
  }

  ngDoCheck(): void {
    this.user = firebase.auth().currentUser;
  }

  subredditAdded(subredditTitle: string): void {
    this.subredditService.addSubreddit(subredditTitle);
  }
}
