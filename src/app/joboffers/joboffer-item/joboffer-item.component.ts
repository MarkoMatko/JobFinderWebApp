import {Component, Input, OnInit} from '@angular/core';
import {JobOffer} from "../../model/joboffer";
import {ActivatedRoute, Router} from "@angular/router";
import {JobOfferService} from "../../service/job-offer.service";

@Component({
  selector: 'app-joboffer-item',
  templateUrl: './joboffer-item.component.html',
  styleUrls: ['./joboffer-item.component.css']
})
export class JobofferItemComponent implements OnInit {

  @Input() jobOffer: JobOffer = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private jobOfferService: JobOfferService) { }

  ngOnInit() {
  }


}
