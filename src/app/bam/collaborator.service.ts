import { Collaborators } from './collaborators.model';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap, map, take, switchMap, mergeMap } from 'rxjs/operators';


interface CollaboratorData {
  id: string;
  userId: string;
  collaboratorId: string;
  collaboratorName: string;
}

@Injectable({
  providedIn: 'root',
})
export class CollaboratorService {
  // tslint:disable-next-line: variable-name
  private _collaborators = new BehaviorSubject<Collaborators[]>([]);



  get collaborators() {
    return this._collaborators.asObservable();
  }


  constructor(private http: HttpClient) {}

  // ------------------------- Get Singles-------------------------


  getCollaborator(id: string) {
    return this.collaborators.pipe(
      take(1),
      map((collaborators) => {
        return { ...collaborators.find((u) => u.id === id) };
      })
    );

  }

  // ---------------------- Get Multiples -------------------------
  getCollaborators() {
    return this.http
      .get<{ [key: string]: CollaboratorData }>(
        'https://freelance-fe04c-default-rtdb.firebaseio.com/collaborators.json'
      )
      .pipe(
        map((collaboratorData) => {
          const collaborators = [];
          for (const key in collaboratorData) {
            if (collaboratorData.hasOwnProperty(key)) {
              collaborators.push(
                new Collaborators(
                  key,
                  collaboratorData[key].collaboratorId,
                  collaboratorData[key].collaboratorName,
                  collaboratorData[key].userId
                )
              );
            }
          }
          return collaborators;
        }),
        tap((collabs) => {
          this._collaborators.next(collabs);
        })
      );
  }

  addCollaborator(
    userId: string,
    collaboratorId: string,
    collaboratorName: string
  ) {
    // check to see if the collaborator is already on the list
    this.getCollaborator(userId).subscribe();

    // add this collaborator to the list
    return this.http.post(
      `https://freelance-fe04c-default-rtdb.firebaseio.com/collaborators.json`,
      {
        userId : userId,
        collaboratorId : collaboratorId,
        collaboratorName : collaboratorName
      }
    ).pipe(
      map((collaboratorData) => {

      }),
      tap((colabs) => {

      })
    )
  }
}
