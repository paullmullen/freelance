import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UtteranceService } from './../bam/utterance.service';
import { Utterance } from './../bam/utterance.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.page.html',
  styleUrls: ['./archived.page.scss'],
})
export class ArchivedPage implements OnInit {
  private UtteranceSub: Subscription;
  loadedUtterances: Utterance[];
  filteredUtterances: Utterance[];
  listedLoadedUtterances: Utterance[];
  private usersUid: string;
  displayData: any;
  isLoading;
  fromDate = Date();
  toDate = Date();

  constructor(private UtteranceService: UtteranceService) {}

  ngOnInit() {
    this.fromDate = Date();
    this.toDate = Date();
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        try {
          if (Utterances) {
            // this is all of the utterances in the database.  Holding on to that for future team collab.
            this.loadedUtterances = Utterances;
            // for now, filter just to those utterances that go with this user.
            this.sortItems('archived', 'asc');
            this.listedLoadedUtterances = this.loadedUtterances.filter(
              (utter) =>
                utter.user === this.usersUid &&
                utter.archived &&
                this.isInRange(utter.archived, this.fromDate, this.toDate)
            );
            this.listedLoadedUtterances.forEach((item) => {
              if (item.archived.length > 10) {
                let month = item.archived.substr(4, 3);
                let year = item.archived.substr(11, 4);
                item.archived = month + ' ' + year;
              }
            });
          }
        } catch (error) {
          console.log('Error in ngOnInit in my-stuff.page.ts ', error);
        }
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.UtteranceService.getUtterances().subscribe((utts) => {
      this.isLoading = false;
    });
    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
  }

  sortItems(prop, order) {
    this.loadedUtterances.sort((a, b) => {
      if (order === 'asc') {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });
  }

  onChangeFrom(event) {
    this.fromDate = event.detail.value;
    if (new Date(this.fromDate) > new Date(this.toDate)) {
      this.toDate = this.fromDate;
    }
    this.onFilterUpdate();
  }

  onChangeTo(event) {
    this.toDate = event.detail.value;
    if (new Date(this.toDate) < new Date(this.fromDate)) {
      this.fromDate = this.toDate;
    }
    this.onFilterUpdate();
  }

  onFilterUpdate() {
    this.listedLoadedUtterances = this.loadedUtterances.filter(
      (utter) =>
        utter.user === this.usersUid &&
        utter.archived &&
        this.isInRange(utter.archived, this.fromDate, this.toDate)
    );
    this.listedLoadedUtterances.forEach((item) => {
      if (item.archived.length > 10) {
        let month = item.archived.substr(4, 3);
        let year = item.archived.substr(11, 4);
        item.archived = month + ' ' + year;
      }
    });
  }

  isInRange(proposedDate: string, fromDate: string, toDate: string) {
    // what is the month and year of the proposed date?
    const proposedMonth = new Date(proposedDate).getMonth() + 1;
    const proposedYear = new Date(proposedDate).getFullYear();
    const fromMonth = new Date(fromDate).getMonth() + 1;
    const fromYear = new Date(fromDate).getFullYear();
    const toMonth = new Date(toDate).getMonth() + 1;
    const toYear = new Date(toDate).getFullYear();

    if (proposedYear < fromYear) {
      return false;
    }
    if (proposedYear > toYear) {
      return false;
    }
    if (proposedYear === fromYear && proposedMonth < fromMonth) {
      return false;
    }
    if (proposedYear === toYear && proposedMonth > toMonth) {
      return false;
    }
    return true;
  }

  emailArchive() {
    const savedItems = [];
    this.listedLoadedUtterances.forEach((item) => {
      savedItems.push({
        utterance: item.utterance,
        tag: item.tag,
        complete: item.complete,
        importance: item.importance,
        urgency: item.urgency,
        project: item.project,
        amount: item.amount,
        received: item.received,
        archived: item.archived,
      });
    });
    this.downloadFile(savedItems);
    console.log('got here');
  }

  downloadFile(data: any) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'archive.csv');
  }
}
