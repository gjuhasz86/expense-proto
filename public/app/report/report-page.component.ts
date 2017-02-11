import {Component} from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
    selector: 'report-page',
    template: `
<tabset>
  <tab heading="Monthly by categories">
    <div class="card card-block">
      <monthly-chart></monthly-chart>
    </div>
  </tab>
  <tab heading="Total balance by accounts" (select)="totalChart.sendReflow()" >
    <div class="card card-block">
      <total-chart #totalChart></total-chart>
    </div>
  </tab>
</tabset>
`
})
export class ReportPageComponent {
}
