import { TagData } from './tag.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap, map, take, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class TagService {

  // tslint:disable-next-line: variable-name
  private _tags = new BehaviorSubject<TagData[]>([]);


  get tags() {
    return this._tags.asObservable();
  }

  constructor(private http: HttpClient) {}

  // ------------------------- Get Singles-------------------------


  getTag(id: string) {
    return this.tags.pipe(
      take(1),
      map((tags) => {
        return { ...tags.find((t) => t.id === id) };
      })
    );
  }

  // ---------------------- Get Multiples -------------------------

  getTags() {
    return this.http
      .get<{ [key: string]: TagData }>(
        'https://freelance-fe04c-default-rtdb.firebaseio.com/tags.json'
      )
      .pipe(
        map((tagsData) => {
          const tags = [];
          for (const key in tagsData) {
            if (tagsData.hasOwnProperty(key)) {
              tags.push(
                new TagData(
                  key,
                  tagsData[key].icon,
                  tagsData[key].tagText
                )
              );
            }
          }
          return tags;
        }),
        tap((tgs) => {
          this._tags.next(tgs);
        })
      );
  }


  // ---------------------------- additional tags services -------------------------



  addNewTag(tagString: string) {
    const newTagString = new TagData(Math.random().toString(), tagString, '');

    return this.http
      .post<TagData>(
        'https://freelance-fe04c-default-rtdb.firebaseio.com/tags.json',
        { ...newTagString, id: null }
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
