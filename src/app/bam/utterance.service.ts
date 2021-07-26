// import { User } from './../auth/user.model';
import { Utterance } from './utterance.model';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap, map, take, switchMap, mergeMap } from 'rxjs/operators';

interface UtteranceData {
  id: string;
  utterance: string;
  tag: string;
  user: string;
  complete: boolean;
  urgency: string;
  importance: string;
  project: string;
  isFinancials: boolean;
  amount: number;
  archived: string;
  received: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtteranceService {
  // tslint:disable-next-line: variable-name
  private _utterances = new BehaviorSubject<Utterance[]>([]);
  public _utteranceCount = 0;

  get utterances() {
    return this._utterances.asObservable();
  }

  @Output() utteranceCount = this._utteranceCount;

  constructor(private http: HttpClient) {}

  // ------------------------- Get Singles-------------------------

  getUtterance(id: string) {
    return this.utterances.pipe(
      take(1),
      map((utterances) => {
        return { ...utterances.find((u) => u.id === id) };
      })
    );
  }

  // ---------------------- Get Multiples -------------------------
  getUtterances() {
    return this.http
      .get<{ [key: string]: UtteranceData }>(
        'https://freelance-fe04c-default-rtdb.firebaseio.com/utterances.json'
      )
      .pipe(
        map((utterancesData) => {
          const utterances = [];
          for (const key in utterancesData) {
            if (utterancesData.hasOwnProperty(key)) {
              utterances.push(
                new Utterance(
                  key,
                  utterancesData[key].utterance,
                  utterancesData[key].tag,
                  utterancesData[key].user,
                  utterancesData[key].complete,
                  utterancesData[key].urgency,
                  utterancesData[key].importance,
                  utterancesData[key].project,
                  utterancesData[key].isFinancials,
                  utterancesData[key].amount,
                  utterancesData[key].archived,
                  utterancesData[key].received
                )
              );
              this._utteranceCount++;
            }
          }
          return utterances;
        }),
        tap((utts) => {
          this._utterances.next(utts);
        })
      );
  }

  // --------------------- additional utterance services---------------------

  addUtterance(
    utteranceString: string,
    utteranceTag: string,
    user: string,
    urgency: string,
    importance: string,
    project: string
  ) {
    const newUtterance = new Utterance(
      Math.random().toString(),
      utteranceString,
      utteranceTag,
      user,
      false, // initially new things are not complete
      urgency,
      importance,
      project
    );
    this.http
      .post<UtteranceData>(
        'https://freelance-fe04c-default-rtdb.firebaseio.com/utterances.json',
        { ...newUtterance, id: null }
      )
      .subscribe((data) => {
        console.log(data);
      });
    this.utterances.pipe(take(1)).subscribe((utterances) => {
      this._utterances.next(utterances.concat(newUtterance));
    });
  }

  // ---------------------------- additional tags services -------------------------

  updateTag(uttId: string, newTag: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          const oldUtterance = updatedUtterances[updatedUtteranceIndex];
          updatedUtterances[updatedUtteranceIndex].tag = newTag;
          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { tag: newTag, id: null }
          );
        }),
        tap((result) => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log('Updated Tag'));
  }

  updateProject(uttId: string, newProject: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].project = newProject;

          // if the item is moved into the received project, mark it as received, otherwise set received to null
          if (newProject === 'Received') {
            updatedUtterances[updatedUtteranceIndex].received = Date();
          } else {
            updatedUtterances[updatedUtteranceIndex].received = null;
          }

          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            {
              project: newProject,
              id: null,
              received: updatedUtterances[updatedUtteranceIndex].received,
            }
          );
        }),
        tap((result) => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log('Updated Project'));
  }

  updateContent(uttId: string, newContent: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].utterance = newContent;


          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            {
              utterance: newContent,
              id: null,
            }
          );
        }),
        tap((result) => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log('Updated Content'));
  }
  updateAmount(uttId: string, newAmount: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].amount = Number(newAmount);
          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { amount: newAmount, id: null }
          );
        }),
        tap((result) => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log('Updated Amount'));
  }

  markComplete(uttId: string, state: boolean) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].complete = state;

          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { complete: state, id: null }
          );
        }),
        tap(() => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log(uttId, ' marked complete'));
  }

  markUrgent(uttId: string,  state: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].urgency = state;

          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { urgency: state, id: null }
          );
        }),
        tap(() => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log(uttId, ' marked urgent', state));
  }

  markImportant(uttId: string,  state: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].importance = state;

          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { importance: state, id: null }
          );
        }),
        tap(() => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log(uttId, ' marked important'));
  }

  moveToFinancials(uttId: string, state: boolean) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].isFinancials = state;

          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { isFinancials: state, id: null }
          );
        }),
        tap(() => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log(uttId, ' marked financials'));
  }

  archive (uttId: string, date: string) {
    let updatedUtterances: Utterance[];
    return this.utterances
      .pipe(
        take(1),
        switchMap((utts) => {
          const updatedUtteranceIndex = utts.findIndex(
            (utt) => utt.id === uttId
          );
          updatedUtterances = [...utts];
          updatedUtterances[updatedUtteranceIndex].archived = date;

          return this.http.patch(
            `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
            { archived: date, id: null }
          );
        }),
        tap(() => {
          this._utterances.next(updatedUtterances);
        })
      )
      .subscribe(() => console.log(uttId, ' archived'));
  }
}

