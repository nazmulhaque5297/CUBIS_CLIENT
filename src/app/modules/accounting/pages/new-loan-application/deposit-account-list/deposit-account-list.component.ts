import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanApplicationService } from 'src/app/services/loan-application.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-deposit-account-list',
  templateUrl: './deposit-account-list.component.html',
  styleUrls: ['./deposit-account-list.component.css']
})
export class DepositAccountListComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  itemList:any=[];

  constructor( public activeModal: NgbActiveModal,private applicationService: LoanApplicationService) { }

  ngOnInit(): void {
    this.applicationService.GetDepositAccountList().pipe(takeUntil(this.destroy$)).subscribe(data => {
      for(let i=0;i<data.length;i++){
          this.itemList.push(data[i]);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  }
