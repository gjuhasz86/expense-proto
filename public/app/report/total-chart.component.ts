import {Component, AfterContentChecked, AfterContentInit} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/add/operator/map';
import {AccountModelRelayService} from "../account/account-relay.component";
import {Account} from "../account/account";
type Chart = any;
import * as _ from "underscore";
import {StatItem, TotalStatData} from "./stat-models";


@Component({
    selector: 'total-chart',
    template: `
<div class="card card-block">
  <form class="form-inline">
    <div class="form-group">
      <input type="date" class="form-control form-control-sm" id="date" name="date"
             [value]="startDate$|async|date:'yyyy-MM-dd'"
             (input)="setStartDate($event.target.value)">
      <input type="date" class="form-control form-control-sm" id="date" name="date"
             [value]="endDate$|async|date:'yyyy-MM-dd'"
             (input)="setEndDate($event.target.value)">
             <button class="btn btn-secondary btn-sm" type="button" (click)="toggleStacking()">Toggle Stacking</button>
    </div>
  </form>
</div>
<div class="card card-block">
     <chart [options]="chartOptions" (load)="saveChart($event.context)"></chart>
</div>
<a (click)="debug()">Debug</a>
<pre>{{this.monthlyStats$|async|json}}</pre>
`
})
export class TotalChartComponent {

    private accounts$: Observable<Account[]> = this.accountSvc.changed
                                                   .map(cs => cs.sort((c1, c2) => c1.name.localeCompare(c2.name)));
    private monthlyStats$ = new ReplaySubject<StatItem[]>(1);
    private rawChart$ = new ReplaySubject<Chart>(1);

    private startDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(2016, 0));
    private endDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(2017, 2));

    private stackingClick$ = new BehaviorSubject<null>(null);
    private stacking$: Observable<string> = this.stackingClick$
                                                .scan(x => !x, true)
                                                .map(x => x ? 'normal' : null);

    private reflow$ = new ReplaySubject<null>(1);


    constructor(private http: Http, private accountSvc: AccountModelRelayService) {
        Observable.combineLatest(this.accounts$, this.monthlyStats$, this.rawChart$, this.startDate$, this.endDate$, this.stacking$)
                  .subscribe(tup => this.refreshChartData(tup[0], tup[1], tup[2], tup[3], tup[4], tup[5]));

        Observable.combineLatest(this.rawChart$, this.reflow$)
                  .subscribe(tup => {
                      tup[0].reflow();
                      console.log("Reflowing...");
                  });

        accountSvc.refresh();
        this.refreshStats();
    }


    saveChart(chart: Chart): void {
        this.rawChart$.next(chart);
    }

    setStartDate(dateStr: Date): void {
        this.startDate$.next(new Date(dateStr));
    }

    setEndDate(dateStr: Date): void {
        this.endDate$.next(new Date(dateStr));
    }

    toggleStacking(): void {
        this.stackingClick$.next(null);
    }

    sendReflow(): void {
        console.log("debug...")
        setTimeout(() => this.reflow$.next(null), 10);
    }

    refreshStats(): void {
        this.http.get(`/api/transactions/stats/total`)
            .map(res => res.json())
            .catch(err => {
                console.log(`Could not get stats`, err);
                return Observable.of([]);
            })
            .subscribe(res => this.monthlyStats$.next(res as StatItem[]))
    }

    refreshChartData(accounts: Account[], stats: StatItem[], chart: Chart, startDate: Date, endDate: Date, stacking: string): void {
        let visibility = {};
        chart.series.forEach(s => visibility[s.name] = s.visible);
        let series = accounts.map(a => ({
            name: a.name,
            data: this.collectStats(a, stats, startDate, endDate),
            visible: visibility[a.id()] ? true : false,
        }));
        if (Object.keys(visibility).length == 0) { series[0].visible = true}

        this.clearChart(chart);
        console.log(series);
        series.forEach(s => chart.addSeries(s, false));
        chart.redraw();
        chart.reflow();
    }

    collectStats(account: Account, stats: StatItem[], startDate: Date, endDate: Date): TotalStatData[] {
        let res = _.chain(stats)
                   .filter(s => s._id.accountId == account.id())
                   .map(s => <TotalStatData>[Date.UTC(s._id.year, s._id.month - 1, s._id.day), s.sum])
                   .sortBy(t => t[0])
                   .value() as TotalStatData[];

        return this.calcRunning(res, account.initialBalance);
        // return res;
    }

    private calcRunning(items: TotalStatData[], initial: number): TotalStatData[] {
        return _.chain(items)
                .reduce((memo: any, item: TotalStatData) => {
                    let total = memo.total + item[1];
                    memo.total = total;
                    memo.balance.push([item[0], total]);
                    return memo;
                }, {total: initial, balance: []})
                .value().balance;
    }


    clearChart(chart: Chart): void {
        while (chart.series.length > 0)
            chart.series[0].remove(true);
    }

    chartOptions: any = {
        chart: {
            type: 'line',
            zoomType: 'x',
            height: 500
        },
        title: {text: 'Total balance'},
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Foo',
            data: [["a", 1], ["b", 3], ["d", 7], ["e", 4]],
            visible: false
        }, {
            name: 'Bar',
            data: [["a", 3], ["b", 1], ["c", 5], ["d", 6], ["e", 4]],
            visible: false
        }]
    };
}