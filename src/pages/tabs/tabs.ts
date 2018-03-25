import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { TowRequestPage } from '../tow-request/tow-request';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = TowRequestPage;
  tab2Root = HomePage;

  constructor() {

  }
}
