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
  demo = {
    zip: [],
    combineLatest: []
  };
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
      console.log('zip => ', `${color} shirt with ${logo}`);
      this.demo.zip = [...this.demo.zip, { color, logo }];
    });

    /* 3.2 combineLatest - the go dutch operator
    combineLatest is the go dutch operator - once they meet their mates one time,
    they will wait for no man. In our case, first function is triggered after
    both color and logo values change. There onwards, either color or logo value
    changed will trigger the log.
    */
    combineLatest(this.color$, this.logo$).subscribe(([color, logo]) => {
      console.log('combineLatest => ', `${color} shirt with ${logo}`);
      this.demo.combineLatest = [...this.demo.combineLatest, { color, logo }]
    });

    /* 3.3 withLatestFrom - the master slave operator
    withLatestFrom operator the master slave operator. At first, master must meet the
    slave. After that, the master will take the lead, giving command. The slave will
    just follow and has no voice. :(
    Can you guess who is the master and who is the slave in our case?

    You guessed it! color is the master while logo is the slave. At first
    (only once), color(master) will look for logo(slave). Once the logo(slave)
    has responded, color(master) will take the lead. Log will get triggered
    whenever the next color(master) value is changed. The logo(slave) value
    changes will not trigger the console log.

      1. Ms. Color picks WHITE <- nothing happen, waiting for slave
      2. Mr. Logo picks FISH <- slave found, wait for the master's command
      3. Ms. Color picks GREEN <- log 01, master says GREEN! So, GREEN + FISH
      4. Mr. Logo picks DOG
      5. Ms. Color picks RED <- log 02, master says RED! So, RED + DOG
      6. Mr. Logo picks BIRD
      7. Ms. Color picks BLUE <- log 03 master says BLUE! So, BLUE + BIRD
    */
    this.color$.pipe(withLatestFrom(this.logo$))
      .subscribe(([color, logo]) => {
        console.log('withLatestFrom => ', `${color} shirt with ${logo}`);
      });

    /* 3.4 forkJoin - the final destination operator
    I call forkJoin operator the final destination operator because they
    are very serious, they only commit once all parties are very sure that they
    are completely true, final destination of each other.
    1. Ms. Color picks WHITE
    2. Mr. Logo picks FISH
    3. Ms. Color picks GREEN
    4. Mr. Logo picks DOG
    5. Ms. Color picks RED
    6. Mr. Logo picks BIRD
    7. Ms. Color picks BLUE
    8. Ms. Color completed <-- color is serious!
    9. Mr. Logo completed <--- log no 01, both logo & color are completed. Final destination!

     */
    forkJoin(this.color$, this.logo$).subscribe(([color, logo]) => {
      console.log('forkJoin => ', `${color} shirt with ${logo}`);
    });

    /* 3.5 Let's say, you only want to make 1 shirt, you only need to know the first color
    and logo, In this case, you don't care about the rest of the info that Ms. Color &
    Mr. Logo provide. You can make use of take or first operator to achieve auto complete
    observable once first color and logo emit. 
    */

    const firstColor$ = this.color$.pipe(take(1));
    const firstLogo$ = this.logo$.pipe(first());

    forkJoin(firstColor$, firstLogo$).subscribe(([color, logo]) => {
      console.log('take(1), first() => ', `${color} shirt with ${logo}`);
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
    */
    this.color$.complete();
    this.logo$.complete();
  }

}
