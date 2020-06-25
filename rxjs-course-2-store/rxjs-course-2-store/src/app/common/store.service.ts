import { Observable, Subject, BehaviorSubject } from 'rxjs';
// This service is made so as to make the backend data avilable to the whole application at once and in the latest form
// So that every time we dont need to make a call to the backend for fetching data

import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { tap, map, filter } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root',
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  // In this situation we dont define an observable using createObservable or any other method
  // We use the "Subject" approach

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map((res) => Object.values(res['payload']))
      )
      .subscibe((courses) => this.subject.next(courses)
      );
  }

  selectBegineerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvanceCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map((courses) =>
        courses.find((course) => course.id === courseId),
        filter(course => !!course)
      )
    );
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === category)
      )
    );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
}
