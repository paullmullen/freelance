import { TagData } from './../tag-utterances/tag.model';
import { TagService } from './../tag-utterances/tag.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Utterance } from './../../bam/utterance.model';
import { UtteranceService } from './../../bam/utterance.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ENETDOWN } from 'node:constants';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  @ViewChild('contentField') theText;

  constructor(
    public viewCtrl: ModalController,
    public areYouSureCtrl: ModalController,
    private UtteranceService: UtteranceService,
    private TagService: TagService
  ) {}

  utteranceId: string;
  UtteranceSub: Subscription;
  TagSub: Subscription;
  loadedUtterance: Utterance[];
  loadedTags: TagData[];
  theUtterance: Utterance[];
  isUrgent: boolean;
  isFinancials: boolean;
  isComplete: boolean;
  isArchived: boolean;
  isImportant: boolean;
  contentChanged: boolean = false;
  projectChanged: boolean = false;

  ngOnInit() {
    // Get Utterance details
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        if (Utterances) {
          this.loadedUtterance = Utterances;
          this.theUtterance = this.loadedUtterance.filter(
            (utter) => utter.id === this.utteranceId
          );
        }
      }
    );
    console.log(this.theUtterance[0]);
    this.isFinancials = this.theUtterance[0].isFinancials ? true : false;
    this.isComplete = this.theUtterance[0].complete ? true : false;
    this.isArchived = this.theUtterance[0].archived ? true : false;
    this.isUrgent = this.theUtterance[0].urgency ? true : false;
    this.isImportant = this.theUtterance[0].importance ? true : false;

    // get list of valid tags
    this.TagSub = this.TagService.tags.subscribe((Tags) => {
      this.loadedTags = Tags;
    });
  }

  onSaveButton() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {}

  ionViewDidEnter() {}

  changeContent(event) {
    this.contentChanged = true;
    console.log('Change Content');

  }

  // gets called on ionBlur, and if the content is changed, update database
  updateContent(event) {
    if (this.contentChanged) {
     this.UtteranceService.updateContent(this.utteranceId, event.detail.srcElement.value);
    }
    this.contentChanged = false;
  }

  changeTag() {
    console.log('Change Tag');
  }

  // gets called on ionBlur, and if the content is changed, update database
  changeProject() {
    this.projectChanged = true;
    console.log('Change Project');
  }

  updateProject(event) {
    if (this.projectChanged) {
      this.UtteranceService.updateProject(this.utteranceId, event.detail.srcElement.value);
      console.log('Update Project');

    }
    this.projectChanged = false;
  }

  changeUrgent(event) {
    this.UtteranceService.markUrgent(this.utteranceId, event.detail.checked);
    console.log('Change Urgent');
  }

  changeImportant(event) {
    this.UtteranceService.markImportant(this.utteranceId, event.checked);

    console.log('Change Important');
  }

  changeFinancial(event) {
    if (event.detail.checked === true) {
      this.isFinancials = true;
    } else {
      this.isFinancials = false;
      this.isArchived = false;
    }
    console.log(this.isFinancials);
  }

  changeComplete(event) {
    this.UtteranceService.markComplete(this.utteranceId, event.checked);

    console.log('Change Complete');
  }
  changeArchived(event) {
    if(event.detail.checked === true) {
    this.UtteranceService.archive(this.utteranceId, Date());
    } else {
      this.UtteranceService.archive(this.utteranceId, null);
    }
    console.log('Change Complete');
  }

}
