import { TagData } from './../tag-utterances/tag.model';
import { TagService } from './../tag-utterances/tag.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Utterance } from './../../bam/utterance.model';
import { UtteranceService } from './../../bam/utterance.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  isLoading: boolean = false;
  content: string;
  theTag: string;
  theProject: string;
  theAmount: string;

  ngOnInit() {
    // Get Utterance details
    this.isLoading = true;
    this.UtteranceSub = this.UtteranceService.utterances.subscribe(
      (Utterances) => {
        if (Utterances) {
          this.loadedUtterance = Utterances;
          this.theUtterance = this.loadedUtterance.filter(
            (utter) => utter.id === this.utteranceId
          );
          this.theProject = this.theUtterance[0].project;
          this.content = this.theUtterance[0].utterance;
          this.theTag = this.theUtterance[0].tag;
          this.isFinancials = this.theUtterance[0].isFinancials ? true : false;
          this.isComplete = this.theUtterance[0].complete ? true : false;
          this.isArchived = this.theUtterance[0].archived ? true : false;
          this.isUrgent = this.theUtterance[0].urgency ? true : false;
          this.isImportant = this.theUtterance[0].importance ? true : false;
          this.theAmount = this.theUtterance[0].amount.toString();
        } else { console.log('error loading utterances'); }
      }
      );

    // get list of valid tags
    this.TagSub = this.TagService.tags.subscribe((Tags) => {
      this.loadedTags = Tags;
    });
    this.isLoading = false;
  }

  onSaveButton() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {

  }

  changeContent(event) {
    this.contentChanged = true;

  }

  // gets called on ionBlur, and if the content is changed, update database
  updateContent(event) {
    if (this.contentChanged) {
      this.UtteranceService.updateContent(
        this.utteranceId,
        event.detail.srcElement.value
      );
    }
    this.contentChanged = false;
  }

  changeTag(event) {

    this.UtteranceService.updateTag(this.utteranceId, event.detail.value);

  }

  // gets called on ionBlur, and if the content is changed, update database
  changeProject(event) {
    this.projectChanged = true;

  }

  updateProject(event) {
    if (this.projectChanged) {
      this.UtteranceService.updateProject(
        this.utteranceId,
        event.detail.srcElement.value
      );

    }
    this.projectChanged = false;
  }

  changeUrgent(event) {
    if (event.detail.checked === true) {
      this.UtteranceService.markUrgent(this.utteranceId, 'Urgent');
    } else {
      this.UtteranceService.markUrgent(this.utteranceId, null);
    }

  }

  changeImportant(event) {
    if (event.detail.checked === true) {
      this.UtteranceService.markImportant(this.utteranceId, 'Important');
    } else {
      this.UtteranceService.markImportant(this.utteranceId, null);
    }

  }

  changeFinancial(event) {
    if (event.detail.checked === true) {
      this.isFinancials = true;
      this.UtteranceService.moveToFinancials(this.utteranceId, true);
    } else {
      this.UtteranceService.moveToFinancials(this.utteranceId, false);

      this.isFinancials = false;
      this.isArchived = false;
    }

  }

  changeComplete(event) {

    if (event === true) {
      this.UtteranceService.markComplete(this.utteranceId, true);
    } else {
      this.UtteranceService.markComplete(this.utteranceId, false);
    }


  }
  changeArchived(event) {
    if (event.detail.checked === true) {
      this.UtteranceService.archive(this.utteranceId, Date());
    } else {
      this.UtteranceService.archive(this.utteranceId, null);
    }

  }

  updateAmount(event) {
    this.UtteranceService.updateAmount(this.utteranceId, event.detail.srcElement.value);
  }

}
