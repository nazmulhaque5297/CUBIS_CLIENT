import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear:any;

  constructor() { }

  ngOnInit(): void {
    const value = new Date().getFullYear();
    this.currentYear = value;
  }

}
