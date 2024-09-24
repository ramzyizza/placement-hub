import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { SortService } from '../shared/sort/sort.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDocument, NewDocument } from '../entities/document/document.model';
import { HttpClient } from '@angular/common/http';
import { DocumentService, EntityResponseType } from '../entities/document/service/document.service';
import { NgForm } from '@angular/forms';
import { constructorParametersDownlevelTransform } from '@angular/compiler-cli';
import { QuillModules } from 'ngx-quill';
import Quill from 'quill';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotesService } from './notes.service';

@Component({
  selector: 'jhi-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements AfterViewInit {
  leftColumnData: string[] = [];
  //documents?: IDocument[];
  documents: any[] = [];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  limit = 1;
  documentId: number = 0;
  new: boolean = false;
  selectedDocument: any = {};
  mainContentVisible: boolean = false;
  leftColumnVisible: boolean = true;
  isSaved: boolean = false;
  userId: number;
  ngAfterViewInit(): void {}

  constructor(
    private router: Router,
    protected sortService: SortService,
    private http: HttpClient,
    protected modalService: NgbModal,
    protected documentService: DocumentService,
    private notesService: NotesService,
    private route: ActivatedRoute
  ) {
    this.userId = 0;
  }

  ngOnInit() {
    //this.getNotes();
    this.http.get<any>('/api/account').subscribe(
      response => {
        this.userId = response.id;
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
    this.notesService.getAlldocuments().subscribe(documents => {
      this.documents = documents.filter(document => document.appUser?.id === this.userId);
    });
  }

  selectNoteCd(document: any): void {
    this.selectedDocument = document;
    this.mainContentVisible = true;
  }

  save() {
    if (this.selectedDocument && this.selectedDocument.id) {
      this.updateDocument();
    } else {
      this.createDocument();
    }
    this.isSaved = true;

    setTimeout(() => {
      this.isSaved = false;
    }, 200);
  }

  updateDocument() {
    if (this.selectedDocument && this.selectedDocument.id) {
      this.notesService.updateDocs(this.selectedDocument).subscribe(
        (response: any) => {
          console.log('Changes saved successfully:', response);
        },
        (error: any) => {
          console.error('Error saving changes:', error);
        }
      );
    } else {
      console.error('Cannot update document: Selected document or its id is missing.');
    }
  }

  createDocument() {
    console.log('Creating a new document...');
    const newDocument: NewDocument = {
      title: '',
      content: '',
      id: null,
    };

    this.documentService.create(newDocument).subscribe(
      (response: any) => {
        console.log('Document created successfully:', response);
      },
      (error: any) => {
        console.error('Error creating document:', error);
      }
    );
  }

  discard() {
    if (this.selectedDocument) {
      if (this.selectedDocument.id) {
        this.documentService.delete(this.selectedDocument.id).subscribe(
          () => {
            this.selectedDocument.isHidden = true;
            this.mainContentVisible = false;
            console.log('Changes discarded successfully');
          },
          error => {
            console.error('Error discarding changes:', error);
          }
        );
      } else {
        this.selectedDocument = {};
        console.log('Changes discarded successfully');
      }
    } else {
      console.error('No document selected');
    }
  }

  /*
  getNotes() {
    this.isLoading = true;
    this.documentService.query().subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.body) {
          this.documents = data.body; //.splice(0, this.limit);
        } else {
          console.error('No notes found in response body.');
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error fetching notes:', error);
      }
    );
  } */

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedItem = event.previousContainer.data[event.previousIndex];
      const targetItem = event.container.data[event.currentIndex];

      // Swap positions in frontend
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      // Update positions in backend
      this.updateDocumentPositions(draggedItem, targetItem).subscribe(
        () => {
          console.log('Positions updated successfully');
        },
        error => {
          console.error('Error updating positions:', error);
          // If an error occurs, revert changes in frontend
          moveItemInArray(event.container.data, event.currentIndex, event.previousIndex);
        }
      );
    }
  }

  private updateDocumentPositions(draggedItem: any, targetItem: any): Observable<any> {
    const draggedId = draggedItem.id;

    const targetId = targetItem.id;

    return this.documentService.find(draggedId).pipe(
      switchMap((draggedDocument: any) => {
        if (!draggedDocument) {
          return throwError(`Document with ID ${draggedId} not found`);
        }

        draggedDocument.newPosition = targetId;

        return this.documentService.update(draggedDocument);
      })
    );
  }

  addNote(): void {
    this.selectedDocument = {};
    this.router.navigate(['/document/new']);
  }

  toggleLeftColumn(): void {
    this.leftColumnVisible = !this.leftColumnVisible; // Toggle the visibility
  }

  getCardContent(content: string): string {
    // Use regular expression to remove HTML tags
    return content.replace(/<\/?[^>]+(>|$)/g, '');
  }

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  };
}
