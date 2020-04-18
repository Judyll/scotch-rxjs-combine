// SOURCE: https://scotch.io/tutorials/rxjs-operators-for-dummies-forkjoin-zip-combinelatest-withlatestfrom

import { Component, OnInit } from '@angular/core';

/* 0. Import RXJS Operators */
import {
  forkJoin, zip, combineLatest, Subject
} from 'rxjs';
import {
  withLatestFrom, take, first
} from 'rxjs/operators';

/* 1. Define shirt color and logo options */
type Color = 'white' | 'green' | 'red' | 'blue';
type Logo = 'fish' | 'dog' | 'bird' | 'cow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /* 2. Create the two persons - color and logo observables.
        They will communicate with us later (when we subscribe) */
  private color$ = new Subject<Color>();
  private logo$ = new Subject<Logo>();

  constructor() {}

  ngOnInit() {
    /* 3. We are ready to start printing shirt. Need to subscribe
    color and log observables to produce shirts, we will write code
    here later.
    */

    /* 3.1 zip - love bird (you jump, i jump)
    zip operator is the love birds operator. In our case, color will wait for logo
    whenever there are new value (vice versa). Both values must change then only
    the log gets triggered.
    1. Ms. Color picks WHITE
    2. Mr. Logo picks FISH <- log 01, WHITE + FISH in pair, love birds!
    3. Ms. Color picks GREEN
    4. Mr. Logo picks DOG <- log 02, GREEN + DOG in pair, love birds!
    5. Ms. Color picks RED
    6. Mr. Logo picks BIRD <- log 03, RED + BIRD in pair love birds!
    7. Ms. Color picks BLUE <- waiting for love...
    */
    zip(this.color$, this.logo$).subscribe(([color, logo]) => {
      console.log('Zip => ', `${color} shirt with ${logo}`);
    });

    /* 4. The two persons(observables) are doing their job, picking color and logo
    */
    this.color$.next('white');
    this.logo$.next('fish');

    this.color$.next('green');
    this.logo$.next('dog');

    this.color$.next('red');
    this.logo$.next('bird');

    this.color$.next('blue');

    /* 5. When the two persons(observables) has no more info, they say bye, bye
      We will write the codes here later. */
    this.color$.complete();
    this.logo$.complete();
  }

}
