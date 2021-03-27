import { Utterance } from './../../folder/utterance.model';
import { UtteranceService } from '../../folder/utterance.service';

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

  onTagSelected(uttId: string, newTag: string, newUtterance: string, user: string) {
    this.loadingCtrl
      .create({
        message: 'Updating tag...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.UtteranceService.updateTag(uttId, newTag, null, user);
        loadingEl.dismiss();
        this.ModalController.dismiss({
          dismissed: true,
        });
      });
  }

  onCancel() {
    this.ModalController.dismiss({
      dismissed: true,
    });
  }
}
