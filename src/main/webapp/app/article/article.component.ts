import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, OnInit, Renderer2 } from '@angular/core';
//import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArticleService } from '../entities/article/service/article.service';

import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { VideoService } from '../entities/video/service/video.service';
import { FavouriteService, RestFavourite } from '../entities/favourite/service/favourite.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { NewFavourite } from '../entities/favourite/favourite.model';
import dayjs from 'dayjs/esm';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

//Are any other imports needed
@Component({
  selector: 'jhi-article',
  templateUrl: 'article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, AfterViewInit {
  //favouriteForm: FormGroup;
  // existing properties and methods...
  //@ViewChild('pdfViewer') pdfViewer: ElementRef;
  [key: string]: any; // Replace SomeType with the actual type

  userId: number;

  @ViewChildren('section1') section1!: QueryList<ElementRef>;
  @ViewChildren('section2') section2!: QueryList<ElementRef>;
  @ViewChildren('section3') section3!: QueryList<ElementRef>;
  @ViewChildren('section4') section4!: QueryList<ElementRef>;
  @ViewChildren('section5') section5!: QueryList<ElementRef>;

  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;
  checkbox4: boolean = false;
  checkbox5: boolean = false;

  //DO NOT DELETE
  //DO NOT DELETE
  cardPos1: number = 1;
  cardPos2: number = 1;
  cardPos3: number = 1;
  cardPos4: number = 1;
  cardPos5: number = 1;
  //DO NOT DELETE
  //DO NOT DELETE

  articles: any[] = []; // Initialize with empty array
  articlesI: any[] = [];
  articlesA: any[] = [];
  articlesT: any[] = [];
  articlesL: any[] = [];
  articlesE: any[] = [];

  videos: any[] = []; // Initialize with empty array
  videosI: any[] = [];
  videosA: any[] = [];
  videosT: any[] = [];
  videosL: any[] = [];
  videosE: any[] = [];

  combinedContentI: any[] = [];
  combinedContentA: any[] = [];
  combinedContentT: any[] = [];
  combinedContentL: any[] = [];
  combinedContentE: any[] = [];
  combinedContent: any[] = [];

  sourceLinksArticle1: string[] = [];
  sourceLinksArticle2: string[] = [];
  sourceLinksArticle3: string[] = [];
  sourceLinksArticle4: string[] = [];
  sourceLinksArticle5: string[] = [];

  sourceLinksVideo1: string[] = [];
  sourceLinksVideo2: string[] = [];
  sourceLinksVideo3: string[] = [];
  sourceLinksVideo4: string[] = [];
  sourceLinksVideo5: string[] = [];

  overlay: string;

  favourites: any[] = []; // Initialize with empty array
  favouriteBtn: SafeHtml[] = [];
  isArticle: boolean[] = [];
  faveID: any[] = [];
  contentID: any[] = [];

  faveIDs: any[] = [];

  favesName: string[] = [];
  favesImg: string[] = [];
  faveIndex: string[] = [];
  tempIndex: number[] = [];
  //280 157.5
  iframeWidth = '560';
  iframeHeight = '315';

  articleWidth = '1000';
  articleHeight = '1000';

  private setFaveSubject = new Subject<number>();
  /*numbersArray: number[] = [1, 2, 3, 4, 5, 6];
  stringsArray: string[] = [
    'https://images.unsplash.com/photo-1641353989082-9b15fa661805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1642190672487-22bde32965f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1641841344411-49dbd02896f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1643223723262-7ce785730cf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1641259041823-e09935369105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODc2Mw&ixlib=rb-1.2.1&q=80&w=400',
    'https://images.unsplash.com/photo-1640938776314-4d303f8a1380?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODc2Mw&ixlib=rb-1.2.1&q=80&w=400',
  ];*/

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 560) {
        this.iframeWidth = '280';
        this.iframeHeight = '157.5';
        this.articleWidth = '350';
        this.articleHeight = '550';
      } else if (window.innerWidth > 560 && window.innerWidth < 900) {
        this.articleWidth = '500';
        this.articleHeight = '500';
      } else {
        this.iframeWidth = '560';
        this.iframeHeight = '315';
        this.articleWidth = '1000';
        this.articleHeight = '1000';
      }
    });
  }

  openFave(i: number): void {
    if (this.isArticle[i]) {
      this.articleOn(i, 'FAVOURITE');
    } else {
      this.videoOn(i, 'FAVOURITE');
    }
    //console.log('hi'); // Prevent default behavior
  }

  protected shiftLeft(buttonId: string): void {
    let sec = 'section' + buttonId;
    let Pos: string = 'cardPos' + buttonId;
    const length: number = this[sec].length - 1;

    if (this[Pos] < length) {
      this.shift(true, this[Pos], this[sec]);
      this[Pos] += 1;
    }
  }

  protected shiftRight(buttonId: string): void {
    let Pos: string = 'cardPos' + buttonId;
    let sec = 'section' + buttonId;

    if (this[Pos] > 0) {
      this.shift(false, this[Pos], this[sec]);
      this[Pos] -= 1;
    }
  }

  private shift(shiftPREV: boolean, cardPos: number, section: QueryList<ElementRef>): void {
    const sectionArray: ElementRef<any>[] = section.toArray();
    if (shiftPREV) {
      const elementAtIndexCurrent: ElementRef<any> | undefined = sectionArray.find((_, index) => index === cardPos);
      const elementAtIndexNext: ElementRef<any> | undefined = sectionArray.find((_, index) => index === cardPos + 1);
      if (elementAtIndexCurrent && elementAtIndexNext) {
        const firstShift: HTMLElement = elementAtIndexCurrent.nativeElement;
        const secondShift: HTMLElement = elementAtIndexNext.nativeElement;
        if (cardPos == 1) {
          this.renderer.setStyle(firstShift, 'z-index', '1');
        }
        firstShift.style.transition = 'transform 0.7s ease';
        secondShift.style.transition = 'transform 0.7s ease';
        firstShift.style.transform = `translateX(-${300}px) scale(0.75)`;
        secondShift.style.transform = `translateX(-${0}px) scale(1)`;
      }
    } else if (!shiftPREV) {
      const elementAtIndexCurrent: ElementRef<any> | undefined = sectionArray.find((_, index) => index === cardPos);
      const elementAtIndexPrev: ElementRef<any> | undefined = sectionArray.find((_, index) => index === cardPos - 1);
      if (elementAtIndexCurrent && elementAtIndexPrev) {
        const shiftAmount = 300; // You can set any desired value here
        const firstShift: HTMLElement = elementAtIndexCurrent.nativeElement;
        const secondShift: HTMLElement = elementAtIndexPrev.nativeElement;
        if (cardPos == 1) {
          this.renderer.setStyle(firstShift, 'z-index', '4');
        }
        firstShift.style.transition = 'transform 0.7s ease';
        secondShift.style.transition = 'transform 0.7s ease';
        firstShift.style.transform = `translateX(${300}px) scale(0.75)`;
        secondShift.style.transform = `translateX(${0}px) scale(1)`;
      }
    }
  }

  private changeZIndex(section: QueryList<ElementRef>, zIndex: number) {
    section.forEach(item => {
      const item1 = item.nativeElement.querySelector('.item-1');
      if (item1) {
        this.renderer.setStyle(item1, 'z-index', zIndex.toString());
      }
    });
  }

  protected articleOff(): void {
    const overlayElements = document.getElementsByClassName('overlayArticle') as HTMLCollectionOf<HTMLElement>;

    // Assuming there's only one element with the specified class, you can access it using [0]
    if (overlayElements.length > 0) {
      overlayElements[0].style.display = 'none';
    }
  }

  protected videoOff(): void {
    const overlayElements = document.getElementsByClassName('overlayVideo') as HTMLCollectionOf<HTMLElement>;

    // Assuming there's only one element with the specified class, you can access it using [0]
    if (overlayElements.length > 0) {
      overlayElements[0].style.display = 'none';
    }
  }

  protected async articleOn(cardId: number, type: string): Promise<void> {
    const overlayElements = document.getElementsByClassName('overlayArticle') as HTMLCollectionOf<HTMLElement>;

    // Assuming there's only one element with the specified class, you can access it using [0]
    if (overlayElements.length > 0) {
      if (window.innerWidth > 560 && window.innerWidth < 900) {
        this.articleWidth = '500';
        this.articleHeight = '500';
      } else if (window.innerWidth <= 560) {
        this.articleWidth = '350';
        this.articleHeight = '550';
      } else {
        this.articleWidth = '1000';
        this.articleHeight = '1000';
      }
      if (type === 'INTERVIEW') {
        this.overlay = await this.sourceLinksArticle1[cardId];
        //console.log(this.overlay);
      } else if (type === 'ASSESSMENT') {
        this.overlay = await this.sourceLinksArticle2[cardId];
        //console.log(this.overlay);
      } else if (type === 'TECHNOLOGY') {
        this.overlay = await this.sourceLinksArticle3[cardId];
        //console.log(this.overlay);
      } else if (type === 'LAW') {
        this.overlay = await this.sourceLinksArticle4[cardId];
        //console.log(this.overlay);
      } else if (type === 'ENGINEERING') {
        this.overlay = await this.sourceLinksArticle5[cardId];
        //console.log(this.overlay);
      } else if (type === 'FAVOURITE') {
        this.overlay = await this.faveIndex[cardId];
      }

      overlayElements[0].style.display = 'block';
    }
  }

  protected async videoOn(cardId: number, type: string): Promise<void> {
    const overlayElements = document.getElementsByClassName('overlayVideo') as HTMLCollectionOf<HTMLElement>;

    // Assuming there's only one element with the specified class, you can access it using [0]
    if (overlayElements.length > 0) {
      if (window.innerWidth < 560) {
        this.iframeWidth = '280';
        this.iframeHeight = '157.5';
      } else {
        this.iframeWidth = '560';
        this.iframeHeight = '315';
      }
      //IDENTIFY WHICH CARD HAS BEEN PRESSED MAYBE START WITH THE FIRST ONE BEING ZERO DEPENDS ON JHIPSTER PRIMARY ID INDEX
      //THIS IS IMPORTANT FOR THE FAVOURITE FILTER BUTTON TO IDENTIFY WHICH FAVOURITE
      if (type === 'INTERVIEW') {
        this.overlay = await this.sourceLinksVideo1[cardId - this.sourceLinksArticle1.length];
      } else if (type === 'ASSESSMENT') {
        this.overlay = await this.sourceLinksVideo2[cardId - this.sourceLinksArticle2.length];
      } else if (type === 'TECHNOLOGY') {
        this.overlay = await this.sourceLinksVideo3[cardId - this.sourceLinksArticle3.length];
      } else if (type === 'LAW') {
        this.overlay = await this.sourceLinksVideo4[cardId - this.sourceLinksArticle4.length];
      } else if (type === 'ENGINEERING') {
        this.overlay = await this.sourceLinksVideo5[cardId - this.sourceLinksArticle5.length];
      } else if (type === 'FAVOURITE') {
        this.overlay = await this.faveIndex[cardId];
      }

      overlayElements[0].style.display = 'block';
    }
  }

  checkedCheckboxCount(): void {
    let countHide: number[] = [];
    let countShow: number[] = [];
    //return [this.checkbox1, this.checkbox2, this.checkbox3].filter(checkbox => checkbox).length;
    const checked: boolean[] = [this.checkbox1, this.checkbox2, this.checkbox3, this.checkbox4, this.checkbox5];
    let filter_checked = false;
    for (let i = 0; i < checked.length; i++) {
      if (!checked[i]) {
        countHide.push(i);
      } else {
        countShow.push(i);
        filter_checked = true;
      }
    }
    if (filter_checked) {
      this.filter(countHide, countShow);
    } else {
      window.location.reload();
    }
  }

  private filter(countHide: number[], countShow: number[]): void {
    const filter = document.getElementsByClassName('filter') as HTMLCollectionOf<HTMLElement>;
    if (countHide.length == 0) {
      for (let i = 0; i < filter.length; i++) {
        filter[i].style.display = 'block';
      }
    } else {
      countHide.forEach(i => {
        //console.log('hide', i);
        filter[i].style.display = 'none';
      });
      countShow.forEach(i => {
        //console.log('show', i);
        filter[i].style.display = 'block';
      });
    }
  }
  //private metaService: Meta,
  constructor(
    private articleService: ArticleService,
    private sanitizer: DomSanitizer,
    private videoService: VideoService,
    private favouriteService: FavouriteService,
    private http: HttpClient,
    private renderer: Renderer2
  ) {
    /*this.favouriteForm = new FormGroup({
      id: new FormControl(null), // Assuming id should be null for a new favourite
      createdAt: new FormControl(null), // Assuming createdAt should be null for a new favourite
      appUser: new FormControl(null),
      article: new FormControl(null),
      video: new FormControl(null)
    });*/
    this.overlay = '';
    this.userId = 0;
    this.setFaveSubject.pipe(debounceTime(300)).subscribe(index => this.setFave(index));
  }

  debouncedSetFave(index: number): void {
    this.setFaveSubject.next(index);
  }
  ngOnInit(): void {
    // Add the CSP directive dynamically
    //this.metaService.addTag({ name: 'Content-Security-Policy', content: "frame-src 'self' data: https://www.youtube.com/" });

    /*this.changeZIndex(this.section1, 1);
    this.changeZIndex(this.section2, 1);
    this.changeZIndex(this.section3, 1);
    this.changeZIndex(this.section4, 1);
    this.changeZIndex(this.section5, 1);*/

    this.getArticles();
    this.getVideos();

    this.getUserInfo()
      .then(userId => {
        this.combineContent();
      })
      .catch(error => {
        console.error('Error fetching user information:', error);
      });
    //console.log('the array10', this.combinedContent.length);
  }

  getUserInfo(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.get<any>('/api/account').subscribe(
        response => {
          this.userId = response.id;

          resolve(this.userId);
        },
        error => {
          //console.log('user ID', this.userId);
          console.error('Error fetching user information:', error);
          reject(error);
        }
      );
    });
  }

  /*this.http.get<any>('/api/account').subscribe(
      response => {
        this.userId = response.id;
        console.log('user ID', this.userId)
      },
      error => {
        console.log('user ID', this.userId)
        console.error('Error fetching user information:', error);

      }
    );*/

  getArticles(): void {
    this.articleService.query().subscribe(
      data => {
        if (data.body) {
          this.articles = data.body; // Assuming the response body contains the array of articles
          this.articlesI = data.body
            .filter(article => article.contentType === 'INTERVIEW') // Filter out articles of type 'interview'
            .map(article => ({ ...article, type: 'article' }));
          this.articlesA = data.body
            .filter(article => article.contentType === 'ASSESSMENT') // Filter out articles of type 'interview'
            .map(article => ({ ...article, type: 'article' }));
          this.articlesT = data.body
            .filter(article => article.contentType === 'TECHNOLOGY') // Filter out articles of type 'interview'
            .map(article => ({ ...article, type: 'article' }));
          this.articlesL = data.body
            .filter(article => article.contentType === 'LAW') // Filter out articles of type 'interview'
            .map(article => ({ ...article, type: 'article' }));
          this.articlesE = data.body
            .filter(article => article.contentType === 'ENGINEERING') // Filter out articles of type 'interview'
            .map(article => ({ ...article, type: 'article' }));

          this.sourceLinksArticle1 = this.articles
            .filter(article => article.contentType === 'INTERVIEW')
            .map(article => article.sourceLink);
          this.sourceLinksArticle2 = this.articles
            .filter(article => article.contentType === 'ASSESSMENT')
            .map(article => article.sourceLink);
          this.sourceLinksArticle3 = this.articles
            .filter(article => article.contentType === 'TECHNOLOGY')
            .map(article => article.sourceLink);
          this.sourceLinksArticle4 = this.articles.filter(article => article.contentType === 'LAW').map(article => article.sourceLink);
          this.sourceLinksArticle5 = this.articles
            .filter(article => article.contentType === 'ENGINEERING')
            .map(article => article.sourceLink);

          this.combineContent();
        } else {
          console.error('No articles found in response body.');
        }
      },
      error => {
        console.error('Error fetching articles:', error);
      }
    );
    //try
  }

  getVideos(): void {
    this.videoService.query().subscribe(
      data => {
        if (data.body) {
          this.videos = data.body; // Assuming the response body contains the array of articles
          //this.videos = data.body.map(video => ({ ...video, type: 'video' }));
          this.videosI = data.body
            .filter(video => video.contentType === 'INTERVIEW') // Filter out articles of type 'interview'
            .map(video => ({ ...video, type: 'video' }));
          this.videosA = data.body
            .filter(video => video.contentType === 'ASSESSMENT') // Filter out articles of type 'interview'
            .map(video => ({ ...video, type: 'video' }));
          this.videosT = data.body
            .filter(video => video.contentType === 'TECHNOLOGY') // Filter out articles of type 'interview'
            .map(video => ({ ...video, type: 'video' }));
          this.videosL = data.body
            .filter(video => video.contentType === 'LAW') // Filter out articles of type 'interview'
            .map(video => ({ ...video, type: 'video' }));
          this.videosE = data.body
            .filter(video => video.contentType === 'ENGINEERING') // Filter out articles of type 'interview'
            .map(video => ({ ...video, type: 'video' }));

          this.sourceLinksVideo1 = this.videos.filter(video => video.contentType === 'INTERVIEW').map(video => video.sourceURL);
          this.sourceLinksVideo2 = this.videos.filter(video => video.contentType === 'ASSESSMENT').map(video => video.sourceURL);
          this.sourceLinksVideo3 = this.videos.filter(video => video.contentType === 'TECHNOLOGY').map(video => video.sourceURL);
          this.sourceLinksVideo4 = this.videos.filter(video => video.contentType === 'LAW').map(video => video.sourceURL);
          this.sourceLinksVideo5 = this.videos.filter(video => video.contentType === 'ENGINEERING').map(video => video.sourceURL);

          this.combineContent();
          //console.log('the array4', this.combinedContent.length);
        } else {
          console.error('No videos found in response body.');
        }
      },
      error => {
        console.error('Error fetching videos:', error);
      }
    );
  }

  combineContent(): void {
    this.combinedContentI = [...this.articlesI, ...this.videosI];
    this.combinedContentA = [...this.articlesA, ...this.videosA];
    this.combinedContentT = [...this.articlesT, ...this.videosT];
    this.combinedContentL = [...this.articlesL, ...this.videosL];
    this.combinedContentE = [...this.articlesE, ...this.videosE];

    this.combinedContent = [
      ...this.combinedContentI,
      ...this.combinedContentA,
      ...this.combinedContentT,
      ...this.combinedContentL,
      ...this.combinedContentE,
    ];

    if (this.combinedContent.length === 20 && this.userId != 0) {
      //ADD CHECK TO VALIDATE  USER ID
      //this.loadFave();
      this.getFave();
    }
    //this.combinedContent = [...this.articlesI, ...this.articlesA, ...this.videosI, ...this.videosA];
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /*async sanitizeUrl(url: string): Promise<SafeResourceUrl> {
    return new Promise((resolve, reject) => {
      try {
        const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        resolve(sanitizedUrl);
      } catch (error) {
        reject(error);
      }
    });
  }*/

  addItem(entity: string, newEntry: number): void {
    const decodedItem = this.decodeHtmlEntity(entity);
    const sanitizedItem = this.sanitizer.bypassSecurityTrustHtml(decodedItem);
    if (newEntry == -1) {
      this.favouriteBtn.push(sanitizedItem);
    } else {
      this.favouriteBtn[newEntry] = sanitizedItem;
    }
  }

  //Function to decode html entities
  private decodeHtmlEntity(entity: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = entity;
    return textArea.textContent || textArea.innerText;
  }

  getFave() {
    this.favouriteService.query().subscribe(
      data => {
        if (data.body) {
          this.favourites = [];
          this.favourites = data.body.filter(favourite => favourite.appUser!.id === this.userId); // Assuming the response body contains the array of favourites

          this.loadFave();
        } else {
        }
      },
      error => {
        console.error('Error fetching favourites:', error);
      }
    );
  }
  loadFave() {
    this.favouriteBtn = [];
    this.favesName = [];
    this.favesImg = [];
    this.faveIndex = [];
    this.isArticle = [];
    this.faveID = [];
    this.contentID = [];

    let trys = this.favourites.length;

    if (trys == 0) {
      for (let i = 0; i < this.combinedContent.length; i++) {
        this.addItem('&#9734;', -1);
      }
    } else {
      for (let index = 0; index < this.combinedContent.length; index++) {
        let found = 0;
        const search = this.combinedContent[index].id;
        const foundArticle = this.favourites.find(obj => obj.article?.id === search);
        //const searchVideo = this.combinedContent[index].id;
        const foundVideo = this.favourites.find(obj => obj.video?.id === search);
        if (foundArticle) {
          found = 1;
          this.addItem('&#127775;', -1);
          const foundArticleIndex = this.favourites.findIndex(obj => obj.article?.id === search);
          this.favesImg.push(this.favourites[foundArticleIndex].article.thumbnail);
          this.favesName.push(this.favourites[foundArticleIndex].article.articleName);
          this.faveIndex.push(this.favourites[foundArticleIndex].article.sourceLink);
          this.isArticle.push(true);
        } else if (foundVideo) {
          found = 2;
          const foundVideoIndex = this.favourites.findIndex(obj => obj.video?.id === search);
          this.favesImg.push(this.favourites[foundVideoIndex].video.thumbnail);
          this.favesName.push(this.favourites[foundVideoIndex].video.videoTitle);
          this.faveIndex.push(this.favourites[foundVideoIndex].video.sourceURL);
          this.isArticle.push(false);
          this.addItem('&#127775;', -1);
          /*const foundVideoIndex = this.favourites.findIndex(obj => obj.video.id === search);
          console.log('Video found at index:', foundVideoIndex);
          console.log('corresponding index:', this.favourites[foundVideoIndex].id);
          console.log('corresponding:', this.favourites[foundVideoIndex].video.id);*/
        } else {
          found = 0;
          this.addItem('&#9734;', -1);
        }
        /*add = '&#9734;';
           is = false;
              contentid = each.id;
              faveid = all.id;
        this.addItem(add);
        this.isArticle.push(is);
        this.faveID.push(faveid);
        this.contentID.push(contentid);
        this.favesName.push(all.article.articleName);
              this.favesImg.push(all.article.thumbnail);
              this.faveIndex.push(i);*/
      }
      /*
      let i = 0;
      for (let each of this.combinedContent) {
        let add: string = '';
        let is: boolean = true;
        let faveid: any = '';
        let contentid: any = '';
        //if (each.) for all in favourites list, if all matches a combinedcontent, add each
        for (let all of this.favourites) {
          //NOTE, WILL PROBABLY NEED FAVOURITE ID FOR DELETING UPDATING
          //WILL NEED TO CHANGE BUTTON DIRECTLY USING HTML ELEMENT POSSIBLY OR CHANGE
          //IT USING THE NEW VARIABLE AFTER IT IS CHANGED

          let keys: string[] = Object.keys(each);


          if (each !== null && each.hasOwnProperty('articleName')) {
            if (all.article !== null && all.article.id == each.id) {
              add = '&#127775;';
              is = true;
              contentid = each.id;
              faveid = all.id;

              this.favesName.push(all.article.articleName);
              this.favesImg.push(all.article.thumbnail);
              this.faveIndex.push(i);
            } else {
              add = '&#9734;';
              is = true;
              contentid = each.id;
              faveid = all.id;
            }
          } else {
            if (all.video !== null && all.video.id == each.id) {
              add = '&#127775;';
              is = false;
              contentid = each.id;
              faveid = all.id;
              this.favesName.push(all.video.videoTitle);
              this.favesImg.push(all.video.thumbnail);
              this.faveIndex.push(i);
            } else {
              add = '&#9734;';
              is = false;
              contentid = each.id;
              faveid = all.id;
            }
          }
        }
        this.addItem(add);
        this.isArticle.push(is);
        this.faveID.push(faveid);
        this.contentID.push(contentid);
        //NOTE, WILL PROBABLY NEED FAVOURITE ID FOR DELETING UPDATING
        //WILL NEED TO CHANGE BUTTON DIRECTLY USING HTML ELEMENT POSSIBLY OR CHANGE
        //IT USING THE NEW VARIABLE AFTER IT IS CHANGED

        i++;
      }
      console.log('FINAL TESTS:', this.isArticle);
      console.log('FINAL TESTS:', this.faveID);*/
    }
  }

  /*loadFav() {
    //TRYING//
    /*this.favesName=[];
    this.favesImg=[];
    this.faveIndex=[];
    this.favouriteBtn=[];
    this.isArticle=[];
    this.faveID=[];
    this.contentID=[];
    //TRYING//


    //this.combinedContent = [...this.combinedContentI, ...this.combinedContentA];
    //console.log('the array3',this.combinedContent.length);
    console.log('array', this.combinedContentI.length);
    console.log('array', this.combinedContentA.length);
    console.log('the array', this.combinedContent.length);
    //this.combinedContent = [...this.combinedContentI, this.combinedContentA];
    console.log('test', 4);
    console.log('the array', this.combinedContent.length);
    //this.getFave();
    console.log('the array', this.combinedContent.length);
    let trys = this.favourites.length;
    console.log('length', trys);
    if (trys == 0) {
      for (let i = 0; i < this.combinedContent.length; i++) {
        this.addItem('&#9734;');
        console.log('fave list', this.favouriteBtn);
      }
    } else {
      let i = 0;
      for (let each of this.combinedContent) {
        let add: string = '';
        let is: boolean = true;
        let faveid: any = '';
        let contentid: any = '';
        //if (each.) for all in favourites list, if all matches a combinedcontent, add each
        for (let all of this.favourites) {
          //NOTE, WILL PROBABLY NEED FAVOURITE ID FOR DELETING UPDATING
          //WILL NEED TO CHANGE BUTTON DIRECTLY USING HTML ELEMENT POSSIBLY OR CHANGE
          //IT USING THE NEW VARIABLE AFTER IT IS CHANGED
          console.log('ATTENTION', all);
          let keys: string[] = Object.keys(each);
          //let key = keys[1];
          console.log('ALLOW', keys);
          //console.log('ALLOW', key);
          //if (each && each.id) {
          if (each !== null && each.hasOwnProperty('articleName')) {
            if (all.article !== null && all.article.id == each.id) {
              add = '&#127775;';
              is = true;
              contentid = each.id;
              faveid = all.id;
              this.favesName.push(all.article.articleName);
              this.favesImg.push(all.article.thumbnail);
              this.faveIndex.push(i);
            } else {
              add = '&#9734;';
              is = true;
              contentid = each.id;
              faveid = all.id;
            }
          } else {
            if (all.video !== null && all.video.id == each.id) {
              add = '&#127775;';
              is = false;
              contentid = each.id;
              faveid = all.id;
              this.favesName.push(all.video.videoTitle);
              this.favesImg.push(all.video.thumbnail);
              this.faveIndex.push(i);
            } else {
              add = '&#9734;';
              is = false;
              contentid = each.id;
              faveid = all.id;
            }
          }
        }
        //NOTE, WILL PROBABLY NEED FAVOURITE ID FOR DELETING UPDATING
        //WILL NEED TO CHANGE BUTTON DIRECTLY USING HTML ELEMENT POSSIBLY OR CHANGE
        //IT USING THE NEW VARIABLE AFTER IT IS CHANGED
        this.addItem(add);
        this.isArticle.push(is);
        this.faveID.push(faveid);
        this.contentID.push(contentid);
        i++;
      }
      console.log('FINAL TESTS:', this.isArticle);
      console.log('FINAL TESTS:', this.faveID);
    }
  }*/

  protected async setFave(index: number): Promise<void> {
    let newFavourite: NewFavourite = {
      id: null, // Assuming id should be null for a new favourite
      createdAt: dayjs(),
      appUser: { id: this.userId },
      article: null,
      video: null,
    };
    //console.log('index', index);
    //console.log(this.favouriteBtn[index].toString());
    //console.log('hiiiiiiiiiii', index);
    if (this.combinedContent[index].hasOwnProperty('articleName')) {
      //const valueToFind = this.contentID[index];
      const valueToFind = this.combinedContent[index].id;
      for (let each of this.favourites) {
        console.log('hi', this.favourites[each]);
      }
      const foundObject = this.favourites.find(obj => obj.article?.id === valueToFind);
      //console.log(valueToFind);
      //console.log(foundObject);
      //console.log(this.contentID[index]);
      //console.log(this.favourites);
      //const foundObject = this.favourites.find(obj => obj.article.id === valueToFind);
      /*try {
        foundObject = this.favourites.find(obj => obj.article.id === valueToFind);
      } catch (error) {
        foundObject = false;
      }*/

      if (foundObject) {
        console.log('✅ The article is present in the array.');

        const count = this.favourites.filter(obj => obj.article?.id === valueToFind).length;
        const foundArticleIndex = this.favourites.findIndex(obj => obj.article?.id === valueToFind);
        let array: number[] = [];
        for (let i = 0; i < count; i++) {
          array.push(this.favourites[foundArticleIndex + i].id);
        }
        this.addItem('&#9734;', index);
        //this.favouriteBtn[index] = '&#9734;';
        /*this.tempIndex = this.faveIndex;
        this.faveIndex = [];
        for (let each of this.tempIndex) {
          if (each != index) {
            this.faveIndex.push(each);
          }
        }*/

        array.forEach(value => {
          //const foundArticleIndex = this.favourites.findIndex(obj => obj.article?.id === valueToFind);
          //const foundIndex = this.favourites[foundArticleIndex].id;
          //this.faveID[index]
          this.favouriteService.delete(value).subscribe(
            (response: HttpResponse<any>) => {
              console.log('Delete successful', response);
              this.getFave();
            },
            error => {
              console.error('delete failed', error);
            }
          );
        });
        //this.getFave();
      } else {
        console.log('⛔️ The article is NOT present in the array.');

        this.addItem('&#127775;', index);
        //this.favouriteBtn[index] = '&#127775;';
        //this.faveIndex.push(index);
        //this.favesName.push(this.combinedContent[index].articleName);
        //this.favesImg.push(this.combinedContent[index].thumbnail);
        let val = Number(this.combinedContent[index].id);
        newFavourite.article = { id: val };
        //this.favouriteForm.get('article')?.setValue({article: val});
        //console.log('1');

        //const valueToFind = this.combinedContent[index].id;
        //const foundObject = this.favourites.find(obj => obj.article.id === valueToFind);
        if (!foundObject) {
          try {
            const response = await this.favouriteService.create(newFavourite).toPromise();
            console.log('Create successful', response);
            await this.getFave();
          } catch (error) {
            console.error('Create failed', error);
          }
        }
      }
      /*try {
  // Code that might throw an error
} catch (error) {
  // Handle the error
}*/
    } else {
      //this.contentID[index];
      //console.log(this.combinedContent[index].id);
      const valueToFind = this.combinedContent[index].id;
      const foundObjec = this.favourites.find(obj => obj.video?.id === valueToFind);
      /*try {
        foundObject = this.favourites.find(obj => obj.video.id === valueToFind);
      } catch (error) {
        foundObject = false;
      }*/

      //console.log(valueToFind);
      //console.log(foundObjec);
      if (foundObjec) {
        console.log('✅ The video is present in the array.');

        const count = this.favourites.filter(obj => obj.video?.id === valueToFind).length;
        const foundVideoIndex = this.favourites.findIndex(obj => obj.video?.id === valueToFind);
        let array: number[] = [];
        for (let i = 0; i < count; i++) {
          array.push(this.favourites[foundVideoIndex + i].id);
        }
        //const foundIndex = this.favourites[foundVideoIndex].id;

        this.addItem('&#9734;', index);
        //this.favouriteBtn[index] = '&#9734;';
        /*this.tempIndex = this.faveIndex;
        this.faveIndex = [];
        for (let each of this.tempIndex) {
          if (each != index) {
            this.faveIndex.push(each);
          }
        }*/
        /*
        let i = 0;
        for (let each of this.faveIndex) {
          if (each == index) {
            this.faveIndex.splice(i, 1);
            this.favesName.splice(i, 1);
            this.favesImg.splice(i, 1);
          }
          i++;
        }*/

        //this.faveID[index]
        array.forEach(value => {
          //const foundArticleIndex = this.favourites.findIndex(obj => obj.article?.id === valueToFind);
          //const foundIndex = this.favourites[foundArticleIndex].id;
          //this.faveID[index]
          this.favouriteService.delete(value).subscribe(
            (response: HttpResponse<any>) => {
              console.log('Delete successful', response);
              this.getFave();
            },
            error => {
              console.error('delete failed', error);
            }
          );
        });
      } else {
        console.log('⛔️ The video is NOT present in the array.');

        this.addItem('&#127775;', index);
        //this.favouriteBtn[index] = '&#127775;';
        //this.faveIndex.push(index);
        //this.favesName.push(this.combinedContent[index].videoTitle);
        //this.favesImg.push(this.combinedContent[index].thumbnail);
        let val = Number(this.combinedContent[index].id);
        newFavourite.video = { id: val };
        //this.favouriteForm.get('video')?.setValue({video: val});
        console.log('2');
        //const valueToFind = this.combinedContent[index].id;
        //const foundObje = this.favourites.find(obj => obj.video.id === valueToFind);
        if (!foundObjec) {
          try {
            const response = await this.favouriteService.create(newFavourite).toPromise();
            console.log('Create successful', response);
            await this.getFave();
          } catch (error) {
            console.error('Create failed', error);
          }
        }
      }
    }
    this.getFave();
    //window.location.reload();

    /*
    //use contentId to know if that id exists whithin favourites
    if (this.favouriteBtn[index].toString() == '&#127775;') {
      this.favouriteBtn[index] = '&#9734;';
      let i = 0;
      for (let each of this.faveIndex) {
        if (each == index) {
          this.faveIndex.splice(i, 1);
          this.favesName.splice(i, 1);
          this.favesImg.splice(i, 1);
        }
        i++;
      }

      this.favouriteService.delete(this.faveID[index]).subscribe(
        (response: HttpResponse<any>) => {
          console.log('Delete successful', response);
        },
        error => {
          console.error('delete failed', error);
        }
      ); //
      this.getFave();
    } else {
      this.favouriteBtn[index] = '&#127775;';
      this.faveIndex.push(index);
      console.log('is an article?', this.isArticle[index]);
      //this.isArticle[index]
      if (this.combinedContent[index].hasOwnProperty('articleName')) {
        this.favesName.push(this.combinedContent[index].articleName);
        this.favesImg.push(this.combinedContent[index].thumbnail);
        let val = Number(this.combinedContent[index].id);
        newFavourite.article = { id: val };
        //this.favouriteForm.get('article')?.setValue({article: val});
        console.log('1');
      } else {
        this.favesName.push(this.combinedContent[index].videoTitle);
        this.favesImg.push(this.combinedContent[index].thumbnail);
        let val = Number(this.combinedContent[index].id);
        newFavourite.video = { id: val };
        //this.favouriteForm.get('video')?.setValue({video: val});
        console.log('2');
      }
      //const newFavourite = this.favouriteForm.value;

      this.favouriteService.create(newFavourite).subscribe(
        response => {
          console.log('Create successful', response);
        },
        error => {
          console.error('Create failed', error);
        }
      );
      this.getFave();
    }*/
  }
}
