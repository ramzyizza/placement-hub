import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from './models/board.model';
import { Column, Row } from './models/column.model';
import { SortService } from '../shared/sort/sort.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICard } from '../entities/card/card.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CardsService } from './cards.service';

@Component({
  selector: 'jhi-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent implements OnInit {
  cards?: ICard[];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  getdata: any;
  dataJson: any;
  userId: number;

  constructor(
    protected cardService: CardsService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    private http: HttpClient,
    protected modalService: NgbModal
  ) {
    this.userId = 0;
  }

  //
  board: Board = new Board('Test Board', []);

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.http.get<any>('/api/account').subscribe(
      response => {
        this.userId = response.id;
        // alert(' this.userId ' + this.userId)
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );

    this.cardService.getAllCards().subscribe(cards => {
      this.dataJson = cards;

      this.loadSubmitted();

      this.loadFirstStage();

      this.loadSecondStage();

      this.loadFinalStage();

      this.loadAccepted();

      this.loadRejected();
    });
  }
  loadSubmitted() {
    const submitted = this.dataJson.filter((data: any) => data.appUser?.id === this.userId && data.applicationStatus === 'SUBMITTED');
    const rows: Row[] = [];
    submitted.map((data1: any) => {
      rows.push(new Row(data1.id, data1.companyName, data1.jobTitle, data1.jobLocation, data1.jobDuration, data1.applicationStatus));
    });
    this.board.columns.push(new Column('SUBMITTED', rows));
  }

  loadFirstStage() {
    const firstStage = this.dataJson.filter((data: any) => data.appUser?.id === this.userId && data.applicationStatus === 'FIRST_STAGE');
    const rows: Row[] = [];
    firstStage.map((data1: any) => {
      rows.push(new Row(data1.id, data1.companyName, data1.jobTitle, data1.jobLocation, data1.jobDuration, data1.applicationStatus));
    });
    this.board.columns.push(new Column('FIRST STAGE', rows));
  }

  loadSecondStage() {
    const secondStage = this.dataJson.filter((data: any) => data.appUser?.id === this.userId && data.applicationStatus === 'SECOND_STAGE');
    const rows: Row[] = [];
    secondStage.map((data1: any) => {
      rows.push(new Row(data1.id, data1.companyName, data1.jobTitle, data1.jobLocation, data1.jobDuration, data1.applicationStatus));
    });
    this.board.columns.push(new Column('SECOND STAGE', rows));
  }

  loadFinalStage() {
    const finalStage = this.dataJson.filter((data: any) => data.appUser?.id === this.userId && data.applicationStatus === 'FINAL_STAGE');
    const rows: Row[] = [];
    finalStage.map((data1: any) => {
      rows.push(new Row(data1.id, data1.companyName, data1.jobTitle, data1.jobLocation, data1.jobDuration, data1.applicationStatus));
    });
    this.board.columns.push(new Column('FINAL STAGE', rows));
  }

  loadAccepted() {
    const accepted = this.dataJson.filter((data: any) => data.appUser?.id === this.userId && data.applicationStatus === 'ACCEPTED');
    const rows: Row[] = [];
    accepted.map((data1: any) => {
      rows.push(new Row(data1.id, data1.companyName, data1.jobTitle, data1.jobLocation, data1.jobDuration, data1.applicationStatus));
    });
    this.board.columns.push(new Column('ACCEPTED', rows));
  }

  loadRejected() {
    const rejected = this.dataJson.filter((data: any) => data.appUser?.id === this.userId && data.applicationStatus === 'REJECTED');
    const rows: Row[] = [];
    rejected.map((data1: any) => {
      rows.push(new Row(data1.id, data1.companyName, data1.jobTitle, data1.jobLocation, data1.jobDuration, data1.applicationStatus));
    });
    this.board.columns.push(new Column('REJECTED', rows));
  }

  drop(event: CdkDragDrop<Row[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.saveItemPosition(event.item.data, status);
  }

  containerClicked(taskId: number) {
    // Handle the click event for the container here
    const cardId = taskId;
    this.router.navigate([`/card/${cardId}/edit`]);
  }

  private saveItemPosition(item: Row, newStatus: string) {
    const id = item.id;
    item.applicationStatus = newStatus;
    let newJson = this.dataJson.filter((data: any) => data.id === id);
    newJson[0].applicationStatus = newStatus.replace(' ', '_');

    this.cardService.UpdateCards(JSON.stringify(newJson[0]), id.toString()).subscribe(cards => {
      this.dataJson = cards;
      this.board.columns = [];

      this.loadAll();
    });
  }

  openCreateCardPopUp(): void {
    // const modalRef = this.modalService.open(CardUpdateComponent, {size: 'lg', backdrop: 'static'});
    this.router.navigate(['/card/new']);
  }

  protected readonly JSON = JSON;
}
