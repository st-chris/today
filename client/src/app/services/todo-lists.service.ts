import { Injectable } from '@angular/core';
import { List } from '@backend/models/list';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoListsService {
  private url = 'http://localhost:5200';

  constructor(private httpClient: HttpClient) {}

  getLists(): Observable<List[]> {
    return this.httpClient.get<List[]>(`${this.url}/todo`);
  }

  getList(id: string): Observable<List> {
    return this.httpClient.get<List>(`${this.url}/todo/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  createList(list: List): Observable<string> {
    return this.httpClient.post(`${this.url}/todo`, list, {
      responseType: 'text',
    });
  }

  updateList(id: string, list: List): Observable<string> {
    return this.httpClient.put(`${this.url}/todo/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteList(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/todo/${id}`, {
      responseType: 'text',
    });
  }
}
