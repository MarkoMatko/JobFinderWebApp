import {Employer} from './employer';

export class JobOffer {
  constructor(public id: number,
              public jobDescription: string,
              public offer: string,
              public jobResponsibilities: string,
              public experienceRequired: string,
              public jobOfferRelationship: JobOfferRelationship,
              public workersWhoApplied: ApplyRelationship[],
              public imgPath?: string) {
  }

}

export class JobOfferRelationship {
  constructor(public id: number,
              public publish: string,
              public expired: string,
              public employer: Employer) {
  }
}

export class ApplyRelationship {
  constructor(public id: number,
              public appliedDateAndTime: string,
              public worker: Worker) {}
}
