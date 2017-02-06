import {Component} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'report-page',
    template: `

<chart [options]="options" (load)="saveInstance($event.context)"></chart>

    <button class="btn btn-secondary btn-sm" type="button"
            (click)="test()">Test</button>
            <pre>{{stuff|json}}</pre>
`
})
export class ReportPageComponent {

    options: any = {
        chart: {
            type: 'column'
        },
        title: {text: 'simple chart'},
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        series: [{
            data: [
                [Date.UTC(1970, 9, 1), 0],
                [Date.UTC(1970, 10, 1), 0.2],
                [Date.UTC(1970, 11, 1), 0.47],
                [Date.UTC(1971, 0, 1), 0.79],
                [Date.UTC(1971, 1, 1), 1.02],
                [Date.UTC(1971, 2, 1), 1.18],
                [Date.UTC(1971, 3, 1), 1.19],
                [Date.UTC(1971, 4, 1), 1.85],
                [Date.UTC(1971, 5, 1), 0.1]
            ]
        }]
    };

    chart: any;

    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }

    private test(): void {
        this.http.get(`/api/transactions/stats/monthly`, ReportPageComponent.genHeaders())
            .map(res => res.json())
            .catch(err => {
                console.log(`Could not list items [__]`, err);
                return Observable.of([]);
            })
            .subscribe(res => {
                this.stuff = res.map(e => [Date.UTC(e._id.year, e._id.month, 1), e.sum]);
                this.chart.series[0].setData(this.stuff, true);
            })
    }

    private stuff: any;

    constructor(protected http: Http) {
    }


    private static genHeaders(): Headers {
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        return h;
    }
}