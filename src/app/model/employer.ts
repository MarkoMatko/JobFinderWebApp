import {User} from './user';
import {Worker} from './worker';

export class Employer {
  constructor(public id: number,
              public credentials: User,
              public name: string,
              public branch: string,
              public description: string,
              public siteLink: string,
              public location: string,
              public logoImgPath: string,
              public evaluations: EvaluationRelationship[]) {
  }
}

export class EvaluationRelationship {
  constructor(public id: number,
              public workerExperience: string,
              public recommendation: string,
              public employerRate: number,
              public stillWorkingForThisEmployer: boolean,
              public worker: Worker) {
  }
}
