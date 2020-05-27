import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {exhaustMap, map} from 'rxjs/operators';
import {ActivatedRoute, Params} from '@angular/router';
import {Worker} from '../../../model/worker';
import {JobOfferService} from '../../../service/job-offer.service';
import {ApplyRelationship} from '../../../model/joboffer';

@Component({
  selector: 'app-job-offer-appliers',
  templateUrl: './job-offer-appliers.component.html',
  styleUrls: ['./job-offer-appliers.component.css']
})
export class JobOfferAppliersComponent implements OnInit {

  id: number;
  applications: ApplyRelationship[] = [];
  constructor(private route: ActivatedRoute, private jobOfferService: JobOfferService) { }

  ngOnInit() {
    const obs: Observable<any>  =  this.route.params.pipe(map((params: Params) => {
        this.id = +params['id'];
        return this.id;
      }
    ), exhaustMap((id) => {
      return this.jobOfferService.findAllAppliersForSpecificJobOffer(id);
    }));

    obs.subscribe((appliedWorkers: ApplyRelationship[]) => {
      this.applications = appliedWorkers;
      console.log(appliedWorkers);
    });
  }

}
