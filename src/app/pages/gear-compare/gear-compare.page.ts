import { Component, OnInit } from '@angular/core';
import { gear } from 'src/app/services';

@Component({
  selector: 'app-gear-compare',
  templateUrl: './gear-compare.page.html',
  styleUrls: ['./gear-compare.page.scss'],
})
export class GearComparePage implements OnInit {
  yourStats = {
    baseAtk: 0,
    percentAtk: 0
  }
  constructor() { }

  ngOnInit() {
  }

}