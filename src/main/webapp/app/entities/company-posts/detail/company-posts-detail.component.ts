import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompanyPosts } from '../company-posts.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-company-posts-detail',
  templateUrl: './company-posts-detail.component.html',
  styleUrls: ['./company-posts-detail.component.scss'],
})
export class CompanyPostsDetailComponent implements OnInit {
  companyPosts: ICompanyPosts | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyPosts }) => {
      this.companyPosts = companyPosts;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
