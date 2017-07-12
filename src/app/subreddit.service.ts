import { Injectable } from '@angular/core';
import { Subreddit } from './subreddit.model';
import { UserPost } from './user-post.model';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable()
export class SubredditService {
  subreddits: FirebaseListObservable<any[]>;
  posts: FirebaseListObservable<any[]>;

  constructor(
    private database: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subreddits = database.list('subreddits');
    this.posts = database.list('posts');
  }

  // sub service
  getSubreddits() {
    return this.subreddits;
  }

  // sub service
  getSubredditById(subredditId: string): FirebaseObjectObservable<any> {
    return this.database.object(`subreddits/${subredditId}`);
  }

  // sub service
  getSubredditPosts(subredditId: string): FirebaseListObservable<any[]> {
    return this.database.list(`subreddits/${subredditId}/userPosts`);
  }

  // sub service
  getSubredditTitle(subredditId: number): FirebaseObjectObservable<any> {
    return this.database.object(`subreddist/${subredditId}/title`);
  }

  // sub service?
  getSubredditTitleFromUrl(): FirebaseObjectObservable<any> {
    let subredditId: string;
    this.route.params.forEach(param => subredditId = param['id']);
    return this.database.object(`subreddits/${subredditId}/title`);
  }

  // sub service?
  addPost(postTitle: string, postContent: string, targetSubredditId: string): void {
    const postToAdd: UserPost = new UserPost(postTitle, postContent, ['first']);
    const newItem = this.posts.push(postToAdd);
    const newPostKey = newItem.key;
    this.database.object(`subreddits/${targetSubredditId}/userPosts`).update({[newPostKey]: true})
  }

  // post service
  getPostById(postId: string): FirebaseObjectObservable<any> {
    return this.database.object(`posts/${postId}`);
  }

  getPostComments(postId: string) {
    return this.database.list(`posts/${postId}/comments`);
  }

  deletePost(postId: string, subredditId: string): void {
    const postToDelete: FirebaseObjectObservable<any> = this.getPostById(postId);
    postToDelete.remove();

    this.database.object(`subreddits/${subredditId}/userPosts/${postId}`).remove();

    this.router.navigate([`subreddits`, subredditId]);
  }

  addSubreddit(title: string): void {
    const newSubreddit = new Subreddit(title, []);
    this.subreddits.push(newSubreddit);
  }

  deleteSubreddit(subId: string): void {
    const subToDelete = this.getSubredditById(subId);
    const postsToDelete = this.getSubredditPosts(subId);

    postsToDelete.subscribe(data => {
      data.forEach(post => {
        console.log(post.$key)
        this.database.object(`posts/${post.$key}`).remove();
      });
    });

    subToDelete.remove();

    this.router.navigate([``]);
  }

  savePostChanges(localPost: any): void {
    const postToEdit = this.getPostById(localPost.$key);
    postToEdit.update({postTitle: localPost.postTitle,
                      description: localPost.description });
  }
}
