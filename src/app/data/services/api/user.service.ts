import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass..class';
import { Observable } from 'rxjs';
import { ICardUser } from '@shared/components/cards/card-user/icard-user.metadata';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiClass {

  /**
   * Get all user from api
   */
  getAllUsers(): Observable<{
    error: boolean,
    msg: string;
    data: ICardUser[]
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<ICardUser[]>(this.url + 'users')
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }

  /**
   * Get one user by id
   * @param id number
   */
  getUserById(id: number): Observable<{
    error: boolean,
    msg: string,
    data: ICardUser
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<ICardUser>(this.url + 'users/' + id)
      .pipe(
        map( r => {
            response.data = r;
            return response;
          }
        ),
        catchError(this.error)
      );
  }
}
