import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ICompanyPosts } from '../entities/company-posts/company-posts.model';
import { CompanyProfileService } from './company-profile.service';
import { IUserCompany } from '../entities/user-company/user-company.model';

// Displays all company profiles
type Post = {
  id: string;
  postContent: string;
  postImage: string;
  postImageContentType: string;
};
@Component({
  selector: 'jhi-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  userID: number;
  posts: ICompanyPosts[] = [];
  testContent: string;
  testContent2: string;
  formatedPosts: Post[] = [];
  userCompany: IUserCompany[] = [];
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    private companyProfileService: CompanyProfileService
  ) {
    this.userID = 0;
    this.testContent = '';
    this.testContent2 = 'test content 2';
  }

  ngOnInit(): void {
    this.http.get<any>('api/account').subscribe(
      response => {
        this.userID = response.id;
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
    this.companyProfileService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      this.testContent = posts[0].postContent;
      this.getPostContent();
    });
    this.companyProfileService.getAllUserCompany().subscribe(users => {
      this.userCompany = users;
      this.testContent2 = users[0].name;
    });
  }
  getPostContent(): void {
    for (const post of this.posts) {
      const parsedPost: Post = {
        id: post.id.toString(),
        postContent: post.postContent!,
        postImage: post.postImage!,
        postImageContentType: post.postImageContentType!,
      };
      this.formatedPosts.push(parsedPost);
    }
  }
}
