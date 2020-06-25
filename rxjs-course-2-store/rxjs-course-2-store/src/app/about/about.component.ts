import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, from, BehaviorSubject, AsyncSubject, ReplaySubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import { fromPromise } from 'rxjs/internal-compatibility';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
      // A subject at the same time is an observable and an observer
      // We can directly emit value with it

      // const subject = new Subject();

      // const series1$ = subject.asObservable();

      // // This is early subsciption
      // series1$.subscribe(val => console.log('early sub ' + val));

      // // from(document, 'keyup');

      // subject.next(1);
      // subject.next(2);
      // subject.next(3);

      // setTimeout(() => {

      //   series1$.subscribe(val => console.log('late sub ' + val));
      //   subject.next(4);
      // }, 5000);
      // Note early subscription will subscribe to the former ones and also to the onces after wards
      // But late subscription will subscribe only to the later one
      // So in late subcription, we get the latest value

      // subject.complete();
      // Here we dont have any way to provide any way to unsubscription

      // const subject = new BehaviorSubject(0);
      const subject = new ReplaySubject();
      // We pass here a degault value so that early subscribers will get that default value
      const series1$ = subject.asObservable();
      series1$.subscribe(val => console.log('early sub ' + val));
      // subject.complete();
      subject.next(1);
      subject.next(2);
      subject.next(3);
      // subject.complete();
      // since the stream is closed so no subscription after this will emit any value
      // So the behaviour will only have the property of remembering the last emitted value only if the stream is not completed
      setTimeout(() => {
        series1$.subscribe(val => console.log('late sub ' + val));
        subject.next(4);
        // value 4 is available to early as well as late subscriber
      }, 3000);

      // series1$.subscribe();

      // Async subject is used for observables which emit a lot of values
      // Here we dont want the intermediate values but only the lasy values
      // So Async subject will wait for the observable completion before emitting any value
      // So that we can get the latest value

      // Replay subject helps us to taka all the intermediate values of any observable
      // We dont have to wait for stream completion

    }


}






