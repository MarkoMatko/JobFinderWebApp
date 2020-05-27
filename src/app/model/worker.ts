import {User} from './user';
import {Employer} from './employer';

export class Worker {
  constructor(public id: number,
              public credentials: User,
              public firstName: string,
              public secondName: string,
              public branch: string,
              public degree: string,
              public CVLink: string,
              public friends: Worker[],
              public followedEmployers: Employer[],
              public reviews: ReviewedRelationship[]) {}
}

export class ReviewedRelationship {
  constructor(public id: string,
              public critics: string,
              public recommendation: string,
              public workerRate: number,
              public stillWorkingForThisEmployer: boolean,
              public employer: Employer) {}
}
