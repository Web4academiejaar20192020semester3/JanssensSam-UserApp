import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { User } from './user';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  users: User[];
  user: User;
  private usersUrl = 'http://localhost:8080/GetUsers';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getUsers(): Observable<User[]> {
    this.messageService.add('UserService: fetched users');
    return this.http.get<User[]>(this.usersUrl).pipe(
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  getUser(userId: string): Observable<User> {
    const url = `http://localhost:8080/GetUserById/${userId}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user userId=${userId}`)),
      catchError(this.handleError<User>(`getUser userId=${userId}`))
    );
  }

  /*updateUserr(user: User): Observable<User> {
    const url = `${this.usersUrl}/${user.userId}`;
    return this.http.put<User>(url, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated user userId=${user.userId}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }*/
  updateUser(user: User) {
    const postUrl = 'http://localhost:8080/GetUsers?firstname='
      + user.firstName
      + '&lastname=' + user.lastName
      + '&age=' + user.age
      + '&gender=' + user.gender
      + '&email=' + user.userId;
    this.http.post(encodeURI(postUrl), null ).subscribe(check => {console.log('Admin updated'); });
  }


  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.userId}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  deleteUser(user: User | number): Observable<User> {
    const userId = typeof user === 'number' ? user : user.userId;
    const url = `${this.usersUrl}/${userId}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted user userId=${userId}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
