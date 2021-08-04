import { EditPage } from './edit/edit.page';
import { TagUtterancesPage } from './tag-utterances/tag-utterances.page';
import {
  IonItemSliding,
  ModalController,
  IonReorderGroup,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { UtteranceService } from './../bam/utterance.service';
import { Utterance } from './../bam/utterance.model';

import { TagData } from './tag-utterances/tag.model';
import { TagService } from './tag-utterances/tag.service';

@Component({
  selector: 'app-my-stuff',
  templateUrl: './my-stuff.page.html',
  styleUrls: ['./my-stuff.page.scss'],
})
export class MyStuffPage implements OnInit, OnDestroy {
  isLoading = false;
  private UtteranceSub: Subscription;
  loadedUtterances: Utterance[];
  filteredUtterances: Utterance[];
  listedLoadedUtterances: Utterance[];
  totalUtterances: number;
  private usersUid: string;
  displayData: any;
  lastShowComplete = false;
  lastWhatToShow = 'all';

  private TagSub: Subscription;
  loadedTags: TagData[];

  private bars: any;
  private colorArray: any;
  showDetailStatus = 'All';
  projectFiltered = false;

  constructor(
    private UtteranceService: UtteranceService,
    private TagService: TagService,
    private modalController: ModalController
  ) {}

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  ngOnInit() {
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        try {
          if (Utterances) {
            // this is all of the utterances in the database.  Holding on to that for future team collab.
            this.loadedUtterances = Utterances;
            // for now, filter just to those utterances that go with this user.
            this.sortItems('project', 'asc');
            this.sortItems('importance', 'dec');
            this.sortItems('urgency', 'dec');
            this.listedLoadedUtterances = this.loadedUtterances.filter(
              (utter) =>
                utter.user === this.usersUid &&
                !(utter.complete === true) &&
                utter.project !== 'Invoiced' &&
                utter.project !== 'Received' &&
                utter.project !== 'Forecast'
            );
          }
          const getData = this.groupMethod(
            this.listedLoadedUtterances,
            'project'
          );
          this.displayData = Object.entries(getData);
        } catch (error) {
          console.log('Error in ngOnInit in my-stuff.page.ts ', error);
        }
      }
    );
    this.TagSub = this.TagService.tags.subscribe((Tags) => {
      this.loadedTags = Tags;
    });
  }

  groupMethod(array, fn) {
    if (array) {
      return array.reduce((acc, current) => {
        const groupName = typeof fn === 'string' ? current[fn] : fn(current);
        (acc[groupName] = acc[groupName] || []).push(current);
        return acc;
      }, {});
    }
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

  ionViewWillEnter() {
    this.isLoading = true;
    this.UtteranceService.getUtterances().subscribe((utts) => {
      this.isLoading = false;
    });
    this.isLoading = true;
    this.TagService.getTags().subscribe(() => {
      this.isLoading = false;
    });
    this.usersUid = JSON.parse(localStorage.getItem('user')).uid;
  }

  ionViewDidEnter() {
    this.totalUtterances = this.loadedUtterances.length;
  }

  ngOnDestroy() {
    if (this.UtteranceSub) {
      this.UtteranceSub.unsubscribe();
    }
    if (this.TagSub) {
      this.TagSub.unsubscribe();
    }
  }

  async onTagUtterance(
    id: string,
    tag: string,
    utterance: string,
    slidingEl: IonItemSliding
  ) {
    slidingEl.close();

    this.modalController
      .create({
        component: TagUtterancesPage,
        componentProps: {
          utteranceId: id,
          utteranceString: utterance,
        },
        swipeToClose: true,
        showBackdrop: true,
      })
      .then((modalEl) => {
        modalEl.present();
      });
    return;
  }

  async onMarkComplete(id: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.UtteranceService.markComplete(id, true);

    // the database is updated, now update the local array of utterances.
    this.loadedUtterances.forEach((item) => {
      if (item.id === id) {
        item.complete = true;
      }
    });
    return;
  }

  async onMoveToFinancials(id: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.UtteranceService.moveToFinancials(id, true);
    this.UtteranceService.updateProject(id, 'Forecast');

    // the database is updated, now update the local array of utterances.
    this.loadedUtterances.forEach((item) => {
      if (item.id === id) {
      }
    });
    return;
  }

  onFilterUpdate(param, event) {
    if (param === 'project') {
      if (!this.projectFiltered) {
        this.listedLoadedUtterances = this.loadedUtterances.filter(
          (utter) => utter.project === event
        );
        this.projectFiltered = true;
      } else {
        this.projectFiltered = false;
        this.listedLoadedUtterances = this.loadedUtterances;
      }
    } else {
      console.log('b');
      this.listedLoadedUtterances = this.loadedUtterances;
      if (param === 'complete') {
        this.lastShowComplete = event.detail.checked;
      } else {
        this.lastWhatToShow = event.detail.value;
      }
    }
    try {
      if (this.lastShowComplete) {
        // show all items
        if (this.lastWhatToShow === 'all') {
          this.filteredUtterances = this.listedLoadedUtterances.filter(
            (utter) =>
              utter.user === this.usersUid &&
              utter.project !== 'Invoiced' &&
              utter.project !== 'Received' &&
              utter.project !== 'Forecast'
          );
        } else if (this.lastWhatToShow === 'tagged') {
          this.filteredUtterances = this.listedLoadedUtterances.filter(
            (utter) =>
              utter.tag.length > 0 &&
              utter.user === this.usersUid &&
              utter.project !== 'Invoiced' &&
              utter.project !== 'Received' &&
              utter.project !== 'Forecast'
          );
        } else {
          this.filteredUtterances = this.listedLoadedUtterances.filter(
            (utter) =>
              utter.tag.length === 0 &&
              utter.user === this.usersUid &&
              utter.project !== 'Invoiced' &&
              utter.project !== 'Received' &&
              utter.project !== 'Forecast'
          );
        }
      } else {
        // only show non-completed items
        if (this.lastWhatToShow === 'all') {
          this.filteredUtterances = this.listedLoadedUtterances.filter(
            (utter) =>
              utter.user === this.usersUid &&
              !(utter.complete === true) &&
              utter.project !== 'Invoiced' &&
              utter.project !== 'Received' &&
              utter.project !== 'Forecast'
          );
        } else if (this.lastWhatToShow === 'tagged') {
          this.filteredUtterances = this.listedLoadedUtterances.filter(
            (utter) =>
              utter.tag.length > 0 &&
              utter.user === this.usersUid &&
              !(utter.complete === true) &&
              utter.project !== 'Invoiced' &&
              utter.project !== 'Received' &&
              utter.project !== 'Forecast'
          );
        } else {
          this.filteredUtterances = this.listedLoadedUtterances.filter(
            (utter) =>
              (utter.tag.length === 0 || !utter.tag.length) &&
              utter.user === this.usersUid &&
              !(utter.complete === true) &&
              utter.project !== 'Invoiced' &&
              utter.project !== 'Received' &&
              utter.project !== 'Forecast'
          );
        }
      }
      this.listedLoadedUtterances = this.filteredUtterances;
      const getData = this.groupMethod(this.listedLoadedUtterances, 'project');
      this.displayData = Object.entries(getData);
    } catch (error) {
      console.log('Error in onFilterUpdate in my-stuffpage.ts', error);
    }
  }

  getIconForTag(tagText: string) {
    try {
      const iconName = this.loadedTags.find((t) => t.tagText === tagText).icon;
      return iconName + '-outline';
    } catch {
      return '';
    }
  }

  reorder(event) {
    this.UtteranceService.updateProject(
      this.findItemIdForEvent(event.detail.from),
      this.findProjectForEvent(event.detail.to)
    );
    this.onFilterUpdate(null, null);
    this.sortItems('project', 'asc');
    this.sortItems('importance', 'dec');
    this.sortItems('urgency', 'dec');
    event.detail.complete();
  }

  findProjectForEvent(location: number) {
    // number is the position in a list of ion-items
    // this list is segmented into subgroups and the subgroup headers are also elements in the list
    // so we have to find into which subgroup the item has been dropped.
    // displayData[][0] holds the project name
    // displayData[][1] holds the individual elements in the project.

    let i = 0;
    let index = 0;
    while (i < this.displayData.length) {
      index += this.displayData[i][1].length + 1;
      if (index > location) {
        return this.displayData[i][0];
      }
      i++;
    }

    console.log('Something went wrong finding project for reordered item.');
    return '';
  }

  findItemIdForEvent(location: number) {
    // number is the position in a list of ion-items
    // this list is segmented into subgroups and the subgroup headers are also elements in the list
    // so we have to find into which subgroup the item has been dropped.
    // displayData[][0] holds the project name
    // displayData[][1] holds the individual elements in the project.

    let i = 0;
    let index = 0;
    let previousIndex = 0;
    while (i < this.displayData.length) {
      // find the right subgroup
      index += this.displayData[i][1].length + 1;
      if (index > location) {
        // now I'm in the right subgroup
        return this.displayData[i][1][location - previousIndex - 1].id;
      }
      // on the Successful loop in While, index will be greater than the position of
      // the item we're looking for, so keep track of where we were
      previousIndex = index;
      i++;
    }

    console.log('Something went wrong finding ItemId for reordered item.');
    return '';
  }

  editItem(id: string, slidingEl: IonItemSliding) {
    {
      slidingEl.close();

      this.modalController
        .create({
          component: EditPage,
          componentProps: {
            utteranceId: id,
          },
        })
        .then((modalEl) => {
          modalEl.present();
        });
      return;
    }
  }

}
