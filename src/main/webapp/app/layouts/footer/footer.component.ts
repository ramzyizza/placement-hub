//IMPORTANT///////
//RELOAD PAGE AFTER STARTING//
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
//import { SpeechRecognitionService } from './speech-recognition.service';
/*
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation: any;
}
=======
import { Component, ViewChild, ElementRef } from '@angular/core';
>>>>>>> parent of 0b2700e (Merge branch 'chibueze-branch' into 'main')

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare class SpeechRecognition {
  continuous: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start(): void;
  stop(): void;
}
*/
declare const annyang: any;
@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @ViewChild('chatInput') chatInput!: ElementRef;

  chatting: any[] = ['Press ALT+SHIFT+k to talk'];
  userChat: any[] = [];

  answer: any = '';
  submit: number = 1;

  out: string = '';
  link: string = '';
  i: number = 0;

  stop: boolean = false;
  incorrect: boolean | undefined;

  recognizedText: string = ''; // Variable to store the recognized speech
  myVariable: string;
  //public myVariable: string | undefined;
  //recognizedText: string[]=[];
  timeoutId: any; // Variable to store the timeout ID
  //,private zone: NgZone,private http: HttpClient
  constructor(private cdr: ChangeDetectorRef, private http: HttpClient, private router: Router) {
    this.myVariable = '';
  }

  startListening(): void {
    if (!this.stop) {
      this.stop = true;
      if (annyang) {
        console.log('speech start');
        // Define the wildcard command.
        const commands = {
          '*speech': (speech: string) => {
            this.recognizedText = speech;
            console.log('Recognized Speech:', this.recognizedText);

            clearTimeout(this.timeoutId); // Clear the timeout when speech is recognized
            this.timeoutId = setTimeout(() => this.stopListening(), 1000); // Reset the timeout
          },
        };

        // Add our commands to annyang.
        annyang.addCommands(commands);

        // Start listening.
        //{ autoRestart: false, continuous: false }
        //annyang.start();
        annyang.resume();

        // Set a timeout to stop listening if no speech is recognized for 5 seconds.
        //this.timeoutId = setTimeout(() => this.stopListening(), 5000);

        // Reset the timeout whenever annyang starts listening again.
        /*annyang.addCallback('start', () => {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.stopListening(), 5000);
      });*/
      }
    } else {
      this.stopListening();
    }
  }

  stopListening(): void {
    this.stop = false;
    if (annyang) {
      // Stop listening.
      //annyang.abort();
      annyang.pause();
      clearTimeout(this.timeoutId); // Clear the timeout when manually stopping
    }
    console.log('Speech stop');
    this.myVariable = this.recognizedText;

    // Manually trigger change detection
    this.cdr.detectChanges();
    // Run the assignment inside Angular's zone to trigger change detection
    /*this.zone.run(() => {
      this.myVariable = this.recognizedText;
    });*/
  }

  //TO PUT RECOGNISED SPEECH IN THE INPUT TAG
  /*// Assuming you have a variable like this in your TypeScript file
let myVariable: string = 'Hello, World!';

// In your HTML input tag, you would use the variable like this
<input type="text" [value]="myVariable">*/

  protected openForm(): void {
    const overlayElements = document.getElementsByClassName('form-popup') as HTMLCollectionOf<HTMLElement>;
    const overlayElementsBtn = document.getElementsByClassName('open-button') as HTMLCollectionOf<HTMLElement>;

    overlayElements[0].style.display = 'block';
    overlayElementsBtn[0].style.display = 'none';
  }

  protected closeForm(): void {
    const overlayElements = document.getElementsByClassName('form-popup') as HTMLCollectionOf<HTMLElement>;
    const overlayElementsBtn = document.getElementsByClassName('open-button') as HTMLCollectionOf<HTMLElement>;

    overlayElements[0].style.display = 'none';
    overlayElementsBtn[0].style.display = 'block';
  }

  navigateToNewPage(desiredRoute: string) {
    this.router.navigate([desiredRoute]);
  }

  decipher(input: string): { message: string; route: string } {
    let ans = '';
    let routeLink = '';
    if (input == '0') {
      ans = 'Should we take a look at how your applications are going?'; //HOMEPAGE
      routeLink = '/';
    } else if (input == '1') {
      ans = 'Want to look at your placement plans on the calendar?';
      routeLink = '/calendar-component';
    } else if (input == '2') {
      ans = 'Shall we go to the ratings page?';
      routeLink = '/ratings';
    } else if (input == '3') {
      ans = 'Want to check out the company profiles?';
      routeLink = '/company-profile';
    } else if (input == '4') {
      ans = 'Do you want to look at our resources?';
      routeLink = '/article-component';
    } else if (input == '5') {
      ans = "Let's keep track of your applications";
      routeLink = '/tracker';
    } else {
      ans = 'Plans to jot down some notes?';
      routeLink = '/notes';
    }

    console.log(input);
    return { message: ans, route: routeLink };
  }

  //(keydown.shift.enter)="send()"
  protected async send(): Promise<void> {
    //console.log(this.chatInput.nativeElement.value);
    let input = this.chatInput.nativeElement.value;
    console.log(input);

    if (this.submit == 1) {
      interface PredictionResponse {
        prediction: any; // replace 'any' with the type of 'prediction'
      }

      /*
      //this.http.post('http://localhost:5000/predict', {description: input}).subscribe(data => {
      this.http.post<PredictionResponse>('http://127.0.0.1:5000/predict', { description: input }).subscribe(data => {
        console.log(data.prediction);
        this.answer = data.prediction;
      });*/
      try {
        const data = await this.http.post<PredictionResponse>('http:/10.130.213.8:5000/predict', { description: input }).toPromise();
        if (data && data.prediction) {
          console.log(data.prediction);
          this.answer = data.prediction;
        } else {
          console.error('Prediction is undefined');
        }
      } catch (error) {
        console.error(error);
      }

      let response = this.decipher(this.answer.toString());
      let mes = input;
      //let unicodeCharacter = String.fromCodePoint(0x1F464);
      let aiMes = response.message + ' Just press enter to continue';
      const filter = document.getElementsByClassName('USER') as HTMLCollectionOf<HTMLElement>;

      //(document.getElementsByClassName("send")[0] as HTMLInputElement).value = "";
      /*const targetElement = document.getElementById('clear');
      if (targetElement) {
        targetElement.innerHTML = targetElement.innerHTML;
        console.log('hioiiiiiiiiiiiiiiiiiiiiii');
      }*/

      const clearButton = document.getElementById('clear') as HTMLInputElement;
      if (clearButton) {
        clearButton.value = '';
      }
      if (this.incorrect) {
        this.chatting.pop();
        this.incorrect = false;
      }

      this.userChat.push(mes);
      filter[this.i].style.display = 'block';
      this.chatting.push(aiMes);
      this.i += 1;
      this.out = response.message;
      this.link = response.route;
      this.submit += 1;
    } else {
      if (input == '') {
        //this.chatting.push(input);
        this.navigateToNewPage(this.link);
      } else {
        this.incorrect = true;
        console.log('no');
        this.chatting.push('Sorry we did not get that right, please try again');
        const clearButton = document.getElementById('clear') as HTMLInputElement;
        if (clearButton) {
          clearButton.value = '';
        }
      }
      this.submit = 1;
    }
  }
}
