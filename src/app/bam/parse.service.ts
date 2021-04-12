import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParseService {
  constructor() {}

  // these hold the position within the utterance of the beginning and end of each token.
  private urgencyTokenPosition = { start: -1, stop: -1 };
  private importanceTokenPosition = { start: -1, stop: -1 };
  // tokenPosition holds the position of one of the projectMarkers below.
  // textPosition holds the location of the project text itself.
  private projectTokenPosition = { start: -1, stop: -1 };  // -1 means undefined
  private projectTextPosition = { start: -1, stop: -1 };
  private importanceToken = '';
  private urgencyToken = '';

  highImportancePhrases = [
    'very important',
    'is important',
    'mark as important',
    'this is important',
    'high importance',
    'important',
  ];

  lowImportancePhrases = [
    'low importance',
    'is not important',
    'is not very important',
    'not very important',
    'not important',
    'not high importance',
    'mark as not important',
    'this is not important',
    'mark as low importance',
  ];

  highUrgencyPhrases = [
    'very urgent',
    'is urgent',
    'high urgency',
    'mark urgent',
    'urgently',
    'urgent',
  ];

  lowUrgencyPhrases = [
    'not urgent',
    'non urgent',
    'non-urgent',
    'not very urgent',
    'low urgency',
    'mark as not urgent',
    'mark as low urgency',
    'not urgently',
  ];

  projectMarkers = [
    'assign to project',
    'assign to category',
    'for project',
    'for category',
    'the project is',
    'the category is',
    'project',
    'category',
  ];

  parse(utterance: string) {
    return {
      utterance: this.getUtterance(utterance),
      importance: this.getImportance(utterance),
      urgency: this.getUrgency(utterance),
      project: this.getProject(utterance),
    };
  }

  getUtterance(utterance: string) {
    return utterance;
  }

  getUrgency(utterance: string) {
    // first check for negative condition
    for (const condition in this.lowUrgencyPhrases) {
      if (
        utterance.toLowerCase().indexOf(this.lowUrgencyPhrases[condition]) >= 0
      ) {
        // mark the location of the low urgency token
        this.urgencyTokenPosition = {
          start: utterance
            .toLowerCase()
            .indexOf(this.lowUrgencyPhrases[condition]),
          stop:
            utterance
              .toLowerCase()
              .indexOf(this.lowUrgencyPhrases[condition]) +
            this.lowUrgencyPhrases[condition].length +
            1,
        };
        this.urgencyToken = '';
        return false;
      }
    }

    // then check positive condition
    for (const condition in this.highUrgencyPhrases) {
      if (
        utterance.toLowerCase().indexOf(this.highUrgencyPhrases[condition]) >= 0
      ) {
        this.urgencyTokenPosition = {
          start: utterance
            .toLowerCase()
            .indexOf(this.highUrgencyPhrases[condition]),
          stop:
            utterance
              .toLowerCase()
              .indexOf(this.highUrgencyPhrases[condition]) +
            this.highUrgencyPhrases[condition].length +
            1,
        };
        this.urgencyToken = this.highUrgencyPhrases[condition];
        return true;
      }
    }
    // if neither positive nor negative, then false
    this.urgencyTokenPosition = { start: -1, stop: -1 };
    this.urgencyToken = '';
    return false;
  }

  getImportance(utterance: string) {
    // first check for negative condition
    for (const condition in this.lowImportancePhrases) {
      if (
        utterance.toLowerCase().indexOf(this.lowImportancePhrases[condition]) >=
        0
      ) {
        // mark the location of the low importance token
        this.importanceTokenPosition = {
          start: utterance
            .toLowerCase()
            .indexOf(this.lowImportancePhrases[condition]),
          stop:
            utterance
              .toLowerCase()
              .indexOf(this.lowImportancePhrases[condition]) +
            this.lowImportancePhrases[condition].length +
            1
        };
        this.importanceToken = '';
        return false;
      }
    }

    // then check positive condition
    for (const condition in this.highImportancePhrases) {
      if (
        utterance
          .toLowerCase()
          .indexOf(this.highImportancePhrases[condition]) >= 0
      ) {
        this.importanceTokenPosition = {
          start: utterance
            .toLowerCase()
            .indexOf(this.highImportancePhrases[condition]),
          stop:
            utterance
              .toLowerCase()
              .indexOf(this.highImportancePhrases[condition]) +
            this.highImportancePhrases[condition].length +
            1
        };
        this.importanceToken = this.highImportancePhrases[condition];
        return true;
      }
    }
    // if neither positive nor negative, then false
    this.importanceTokenPosition = { start: -1, stop: -1 };
    this.importanceToken = '';
    return false;
  }

  getProject(utterance: string) {
    let pStart = -1;
    let pEnd = -1;
    for (const condition in this.projectMarkers) {
      if (utterance.toLowerCase().match(this.projectMarkers[condition])) {
        pStart =
          utterance.toLowerCase().indexOf(this.projectMarkers[condition]) +
          this.projectMarkers[condition].length +
          1;
        pEnd = utterance.length; // ok, we found a marker, now we will assume that project takes up the rest of utterance.

        // now, if urgent/important come after project, truncate project
        if (this.importanceTokenPosition.start !== -1) {
          // -1 means it has not been assigned
          if (this.importanceTokenPosition.stop > pStart) {
            // the important token comes after the projectMarker
            if (this.importanceTokenPosition.start < pEnd) {
              pEnd = this.importanceTokenPosition.start - 1;
            }
          }
        }
        if (this.urgencyTokenPosition.start !== -1) {
          // -1 means it has not been assigned
          if (this.urgencyTokenPosition.stop > pStart) {
            // the important token comes after the projectMarker
            if (this.urgencyTokenPosition.start < pEnd) {
              pEnd = this.urgencyTokenPosition.start - 1;
            }
          }
        }

        // ok, the text has been parsed, now store the locations before returning the text
        this.projectTokenPosition = {
          start: utterance
            .toLowerCase()
            .indexOf(this.projectMarkers[condition]),
          stop:
            utterance.toLowerCase().indexOf(this.projectMarkers[condition]) +
            this.projectMarkers[condition].length,
        };
        this.projectTextPosition = { start: pStart, stop: pEnd };
        return this.toTitleCase(utterance.substring(pStart, pEnd));
      }
    }
    return '';
  }

  getCleanUtterance(utterance: string) {
    if (this.importanceToken.length > 0) {
      utterance.replace(this.importanceToken, ' ');
    }
    if (this.urgencyToken.length > 0) {
      utterance.replace(this.importanceToken, ' ');
    }
    return utterance;
  }


  toTitleCase(str: string) {
    if (str.length > 0) {
      return str
        .trim()
        .split(' ')
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ');
    } else {
    }
    return '';
  }
}
