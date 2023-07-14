import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage implements OnInit {
  gearType: gear[] = [
    { type: "microreactor" }
  ]
  constructor() { }

  ngOnInit() {
  }

}

interface gear {
  type: string;
  icon?: string;
}

interface stat {
  
}