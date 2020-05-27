import {Component, OnDestroy, OnInit} from '@angular/core';
import {JobOffer} from "../model/joboffer";
import {JobOfferService} from "../service/job-offer.service";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-joboffers',
  templateUrl: './joboffers.component.html',
  styleUrls: ['./joboffers.component.css']
})
export class JoboffersComponent implements OnInit, OnDestroy {

  jobOffers: JobOffer[] = [];
  filteredJobOffers: JobOffer[] = [];
  jobOffersSub: Subscription = new Subscription();
  search = '';

  constructor(private jobOfferService: JobOfferService) { }

  ngOnInit() {
    this.jobOffersSub = this.jobOfferService.jobOffersChange
      .subscribe((jobOffers: JobOffer[]) => {
        this.jobOffers = jobOffers;
        this.filteredJobOffers = jobOffers;
      });
    this.jobOfferService.getAllJobOffers();

  }

  ngOnDestroy(): void {
    this.jobOffersSub.unsubscribe();
  }

  onSearch() {
    if (this.search === '') {
      this.filteredJobOffers = this.jobOffers;
      return;
    }
    this.filteredJobOffers = [];
    this.jobOffers.forEach((value: JobOffer) => {
      if (this.filteredJobOffers.indexOf(value) === -1 && value.jobDescription.toLowerCase().includes(this.search.toLowerCase())) {
        this.filteredJobOffers.push(value);
      }
      if (this.filteredJobOffers.indexOf(value) === -1 && value.jobOfferRelationship.employer.name.toLowerCase().includes(this.search.toLowerCase())) {
        this.filteredJobOffers.push(value);
      }
      if (this.filteredJobOffers.indexOf(value) === -1 && value.jobOfferRelationship.employer.location.toLowerCase().includes(this.search.toLowerCase())) {
        this.filteredJobOffers.push(value);
      }
    });
  }
}
