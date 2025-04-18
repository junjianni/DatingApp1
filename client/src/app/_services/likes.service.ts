import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/pagination';
import { Member } from '../_models/member';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {})
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.http.get<Member[]>(`${this.baseUrl}likes`, 
      {observe: 'response', params}).subscribe({
        next: response => setPaginatedResponse(response, this.paginatedResult)
      })
    // return this.http.get<Member[]>(`${this.baseUrl}likes?predicate=${predicate}`);
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}
// function setPaginationHeaders(pageNumber: number, pageSize: number) {
//   throw new Error('Function not implemented.');
// }

// function setPaginatedResponse(response: ArrayBuffer, paginatedResult: WritableSignal<PaginatedResult<Member[]> | null>): void {
//   throw new Error('Function not implemented.');
// }

