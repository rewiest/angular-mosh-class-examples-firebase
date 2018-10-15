
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  authorsRef: AngularFireList<any> = null;
  authors: Observable<any[]>;
  authorsKeys;

  coursesRef: AngularFireList<any> = null;
  courses: Observable<any[]>;
  coursesKeys;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.authorsRef = this.db.list('/authors');
    this.authors = this.db.list('/authors').snapshotChanges();

    this.authorsRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({key: a.key, ...a.payload.val() }))
      )
    ).subscribe(authors => {
      this.authorsKeys = authors.map(author => author.key);
      console.log ('Authors Keys');
      console.log (this.authorsKeys);
      return this.authorsKeys;
    });

    this.coursesRef = this.db.list('/courses');
    this.courses = this.db.list('/courses').snapshotChanges();

    this.coursesRef.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({key: a.key, ...a.payload.val() }))
      )
    ).subscribe(courses => {
      this.coursesKeys = courses.map(course => course.key);
      console.log ('Courses Keys');
      console.log (this.coursesKeys);
      return this.coursesKeys;
    });
  }

  addAuthor(firstinput: HTMLInputElement, lastinput: HTMLInputElement) {
    this.authorsRef.push({first: firstinput.value, last: lastinput.value});
    firstinput.value = '';
    lastinput.value = '';
  }

  updateAuthor(key, firstinput: HTMLInputElement, lastinput: HTMLInputElement) {
    console.log(key);
    this.authorsRef.update(key, {first: firstinput.value, last: lastinput.value});
    firstinput.value = '';
    lastinput.value = '';
  }

  deleteAuthor(key) {
    this.authorsRef.remove(key);
  }

  addCourse(courseinput: HTMLInputElement) {
    this.coursesRef.push(courseinput.value);
    courseinput.value = '';
  }

  updateCourse(key, nameinput: HTMLInputElement) {
    this.coursesRef.set(key, nameinput.value);
    nameinput.value = '';
  }

  deleteCourse(key) {
    this.coursesRef.remove(key);
  }
}
