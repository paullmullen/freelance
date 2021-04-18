import { Utterance } from './../../bam/utterance.model';
import { UtteranceService } from '../../bam/utterance.service';

import { TagService } from '../tag-utterances/tag.service';
import { TagData } from './tag.model';

import { Subscription } from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-utterances',
  templateUrl: './tag-utterances.page.html',
  styleUrls: ['./tag-utterances.page.scss'],
})


export class TagUtterancesPage implements OnInit {
  loadedTags: TagData[];
  loadedUtterances: Utterance[];
  isLoading = false;
  private TagSub: Subscription;
  private UtteranceSub: Subscription;
  private user: string;

  @Input() utteranceString: string;
  @Input() utteranceId: string;

  constructor(
    public ModalController: ModalController,
    private UtteranceService: UtteranceService,
    private loadingCtrl: LoadingController,
    private TagService: TagService
  ) {}

  ngOnInit() {
    this.TagSub = this.TagService.tags.subscribe((Tags) => {
      this.loadedTags = Tags;
    });
    this.UtteranceSub = this.UtteranceService.utterances.subscribe((Utterances) => {
      this.loadedUtterances = Utterances;
    });
    this.user = JSON.parse(localStorage.getItem('user')).uid;

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.UtteranceService.getUtterances().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.TagSub) {
      this.TagSub.unsubscribe();
    }
  }

  onTagSelected(uttId: string, newTag: string, newUtterance: string) {
    this.loadingCtrl
      .create({
        message: 'Updating tag...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.UtteranceService.updateTag(uttId, newTag, null, this.user);
        loadingEl.dismiss();
        this.ModalController.dismiss({
          dismissed: true,
        // the cloud database is updated, now update the local array of utterances.
      });
        this.loadedUtterances.forEach(item => {
        if (item.id === uttId) {
          item.tag = newTag;
        }
      });
      });
  }

  onCancel() {
    this.ModalController.dismiss({
      dismissed: true,
    });
  }
}
