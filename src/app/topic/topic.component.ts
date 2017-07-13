import { Component, OnInit } from '@angular/core';
import { UserPost } from './../user-post.model';
import { SubredditService } from './../subreddit.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
  providers: [SubredditService]
})

export class TopicComponent implements OnInit {
  subredditId: string = null;
  subredditTitle: FirebaseObjectObservable<any>;
  postListObservable: FirebaseListObservable<any[]>;
  posts = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private subredditService: SubredditService
  ) { }

  ngOnInit(): void {
    this.route.params.forEach(urlParam => {
      this.subredditId = urlParam['id'];
    });

    this.postListObservable = this.subredditService.getSubredditPosts(this.subredditId);

    this.postListObservable.subscribe(data => {
      this.posts = [];
      data.forEach(postReference => {
        this.subredditService.getPostById(postReference.$key).subscribe(post => this.posts.push(post));
      });
    });

    this.subredditService.getSubredditById(this.subredditId).subscribe(sub => this.subredditTitle = sub.title);
  }

  newPostSubmit(postTitle: string, postContent: string): void {
    this.subredditService.addPost(postTitle, postContent, this.subredditId);
  }

  deleteSubredditButtonClicked(subId: string): void {
    if(confirm("Are you sure you want to delete this subreddit?")){
      this.subredditService.deleteSubreddit(subId);
    }
  }
}
