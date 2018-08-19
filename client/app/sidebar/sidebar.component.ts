import { Component, OnInit } from '@angular/core';
import { SidebarService} from "../services/sidebar.service"

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private sidebarData: SidebarService) { }

  sidebarState = {};
  classifiedCategories = [];


  ngOnInit() {
    this.sidebarData.currentSidebarState.subscribe(sidebarState => this.sidebarState = sidebarState);
    this.classifiedCategories = ["Носки", "Трусы", "Автомобили" ]
  }

  renewSidebarCriteria() {
    this.sidebarData.changeSidebarData(this.sidebarState)
  }

}
