import {Component, OnInit} from 'angular2/core';
import {PostService} from '../services/post.service';
import {UserService} from '../services/user.service';
import {SpinnerComponent} from './spinner.component';
import {PaginationComponent} from './pagination.component';

@Component({
    templateUrl: 'app/templates/posts.template.html',
    styles: [`
        .posts li { cursor: default; }
        .posts li:hover { background: #ecf0f1; }
        .list-group-item.active,
        .list-group-item.active:hover,
        .list-group-item.active:focus {
            background-color: #ecf0f1;
            border-color: #ecf0f1;
            color: #2c3e50;
        }
        .clickable {
            cursor: pointer;
        }
        .thumbnail {
            border-radius: 100%;
        }
    `],
    providers: [PostService, UserService],
    directives: [SpinnerComponent, PaginationComponent]
})
export class PostsComponent implements OnInit {
	  posts = [];
    users = [];
    pagedPosts = [];
    postsLoading;
    commentsLoading;
    currentPost;
    pageSize = 10;

    constructor(
        private _postService: PostService,
        private _userService: UserService) {
  	}

  	ngOnInit() {
          this.loadUsers();
          this.loadPosts();
  	}

    private loadUsers(){
        this._userService.getUsers()
          .subscribe(users => this.users = users);
    }

    private loadPosts(filter?){
        this.postsLoading = true;
    		this._postService.getPosts(filter)
    			.subscribe(
              posts => {
                  this.posts = posts;
                  this.pagedPosts = _.take(this.posts, this.pageSize);
              },
              null,
              () => { this.postsLoading = false; });
    }

    reloadPosts(filter){
        this.currentPost = null;

        this.loadPosts(filter);
    }

    select(post){
		    this.currentPost = post;

        this.commentsLoading = true;
        this._postService.getComments(post.id)
            .subscribe(
                comments => this.currentPost.comments = comments,
                null,
                () => this.commentsLoading = false);
    }

    onPageChanged(page) {
      var startIndex = (page - 1) * this.pageSize;
      this.pagedPosts = _.take(_.rest(this.posts, startIndex), this.pageSize);
  	}
}
