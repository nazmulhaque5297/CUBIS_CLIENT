import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { HouseKeepingService } from '../../house-keeping.service';

@Component({
  selector: 'app-migrate-old-user',
  templateUrl: './migrate-old-user.component.html',
  styleUrls: ['./migrate-old-user.component.css']
})
export class MigrateOldUserComponent implements OnInit,OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userMigrationForm: FormGroup;

  constructor(private houseKeepingService: HouseKeepingService,
     private spinner: NgxSpinnerService,
     private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onSubmitProcess():void{
    this.spinner.show();
    this.houseKeepingService.migrateUsers().pipe(first()).subscribe((x:any) => {
      this.spinner.hide();
      this.toastr.success("Process Done.");
    }, err => {
      this.spinner.hide();
    })
  }

}
