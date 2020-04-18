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
  ngOnInit() {

  }
}
