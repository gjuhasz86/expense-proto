import {Component} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {CategoryModelRelayService} from "../category/category-relay.component";
import {Category} from "../category/category";
import 'rxjs/add/operator/map';
type Chart = any;

@Component({
    selector: 'report-page',
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
    </div>
  </form>
</div>
<chart [options]="chartOptions" (load)="saveChart($event.context)"></chart>
      <button class="btn btn-danger btn-sm" type="button"
              (click)="debug()">Debug
      </button>
`
})
export class ReportPageComponent {

    private categories$: Observable<Category[]> = this.categorySvc.changed;
    private monthlyStats$ = new ReplaySubject<StatItem[]>(1);
    private rawChart$ = new ReplaySubject<Chart>(1);

    private startDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(2016, 0));
    private endDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(2016, 11));

    private chart$ = Observable.combineLatest(this.rawChart$, this.startDate$, this.endDate$)
                               .map(x => this.setChartLabelsTup(x));

    private statFeed$: Observable<[Array<Category>, Array<StatItem>, Chart]> =
        Observable.combineLatest(this.categories$, this.monthlyStats$, this.chart$);


    constructor(private http: Http, private categorySvc: CategoryModelRelayService) {
        this.statFeed$.subscribe(tup => this.refreshChartData(tup[0], tup[1], tup[2]));
        categorySvc.refresh();
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


    refreshStats(): void {
        this.http.get(`/api/transactions/stats/monthly`)
            .map(res => res.json())
            .catch(err => {
                console.log(`Could not get monthly stats`, err);
                return Observable.of([]);
            })
            .subscribe(res => this.monthlyStats$.next(res as StatItem[]))
    }

    refreshChartData(categories: Category[], stats: StatItem[], chart: Chart): void {
        let series = categories.map(c => ({
            name: c.shortName,
            data: this.collectStats(c, stats),
            visible: false
        }));
        if (series[0] != null) { series[0].visible = true;}

        this.clearChart(chart);
        series.forEach(s => {
            // TODO: bug - exception when too much data? start debugging here
            // console.log(s);
            chart.addSeries(s, true)
        });
    }

    collectStats(category: Category, stats: StatItem[]): StatData[] {
        let relevantStats = stats.filter(s => s._id.categories.includes(category.id()));
        return relevantStats.map(s => <[string,number]>[this.yearMonth(s._id.year, s._id.month), s.sum * -1])
    }

    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    yearMonth(y: number, m: number): string {
        let mStr = this.months[m];
        return `${y} ${mStr}`;
    }


    setChartLabelsTup(tup: [Chart,Date,Date]): Chart {
        return this.setChartLabels(tup[0], tup[1], tup[2]);
    }

    setChartLabels(chart: Chart, from: Date, to: Date): Chart {
        let labels = this.generateLabels(from, to);
        this.clearChart(chart);
        chart.xAxis[0].setCategories(labels);
        return chart;
    }

    generateLabels(from: Date, to: Date): string[] {
        let y1 = from.getFullYear();
        let m1 = from.getMonth();
        let y2 = to.getFullYear();
        let m2 = to.getMonth();

        let labels = [];

        let y = y1;
        let m = m1;
        while (y <= y2 && m <= m2) {
            labels.push(this.yearMonth(y, m++));
            if (m == 12) {
                m = 0;
                y++;
            }
        }

        return labels;
    }

    clearChart(chart: any): void {
        while (chart.series.length > 0)
            chart.series[0].remove(true);
    }

    chartOptions: any = {
        chart: {
            type: 'column'
        },
        title: {text: 'simple chart'},
        xAxis: {
            type: 'category',
            categories: [],
            title: {
                text: 'Date'
            }
        },
        series: []
    };
}

type StatData = [string,number];

type StatItem = {
    _id: {
        year: number
        month: number
        categories: string[]
    }
    sum: number
};
