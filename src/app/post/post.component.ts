import { Component, OnInit } from '@angular/core';
import { UserPost } from './../user-post.model';
import { SubredditService } from './../subreddit.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [SubredditService]
})

export class PostComponent implements OnInit {
  selectedPost: FirebaseObjectObservable<any>;
  localSelectedPost: any;
  selectedPostComments: FirebaseListObservable<any[]>;
  selectedPostId: string = null;
  selectedSubId: string = null;
  selectedPostSubreddit: string = null;
  editingPost: FirebaseObjectObservable<any> = null;
  user;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private subredditService: SubredditService
  ) { }

  ngOnInit(): void {
    this.route.params.forEach(urlParam => {
      this.selectedPostId = urlParam['postId'];
      this.selectedSubId = urlParam['id'];
    });

    this.selectedPost = this.subredditService.getPostById(this.selectedPostId);

    this.selectedPost.subscribe(data => {
      this.localSelectedPost = data;
    });

    this.selectedPostComments = this.subredditService.getPostComments(this.selectedPostId);

    this.subredditService.getSubredditTitleFromUrl().subscribe(title => this.selectedPostSubreddit = title.$value);
  }

  ngDoCheck(): void {
    this.user = firebase.auth().currentUser;
  }

  formSubmit(comment: string): void {
    this.selectedPostComments.push(comment);
  }

  deleteButtonClicked(thisPost: FirebaseObjectObservable<any>): void {
    thisPost.subscribe(data => {
      this.subredditService.deletePost(data.$key, this.selectedSubId);
    });
  }

  beginEditing(postToEdit: any): void {
    this.editingPost = postToEdit;
  }

  stopEditing(postToSave: any): void {
    this.editingPost = null;
    this.subredditService.savePostChanges(postToSave);
  }
}
