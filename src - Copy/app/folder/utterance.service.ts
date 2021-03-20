import { Utterance } from './utterance.model';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap, map, take, switchMap } from 'rxjs/operators';

interface UtteranceData {
  id: string;
  utterance: string;
  tag: string;
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



  constructor(private http: HttpClient ) {}

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
                  utterancesData[key].tag
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

  addUtterance(utteranceString: string, utteranceTag: string) {
    const newUtterance = new Utterance(
      Math.random().toString(),
      utteranceString,
      utteranceTag
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

    updateTag(uttId: string, newTag: string, newUtterance: string) {
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
            updatedUtterances[updatedUtteranceIndex] = new Utterance(
              oldUtterance.id,
              oldUtterance.utterance,
              newTag
            );
            return this.http.patch(
              `https://freelance-fe04c-default-rtdb.firebaseio.com/utterances/${uttId}.json`,
              { tag: newTag, id: null }
            );
          }),
          tap(() => {
            this._utterances.next(updatedUtterances);
          })
        )
        .subscribe(() => console.log('Updated Tag'));
    }

}
