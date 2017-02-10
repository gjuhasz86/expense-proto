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
             <button class="btn btn-secondary btn-sm" type="button" (click)="toggleStacking()">Toggle Stacking</button>
    </div>
  </form>
</div>
<div class="card card-block">
     <chart [options]="chartOptions" (load)="saveChart($event.context)"></chart>
</div>
`
})
export class ReportPageComponent {

    private categories$: Observable<Category[]> = this.categorySvc.changed
                                                      .map(cs => cs.sort((c1, c2) => c1.name.localeCompare(c2.name)));
    private monthlyStats$ = new ReplaySubject<StatItem[]>(1);
    private rawChart$ = new ReplaySubject<Chart>(1);

    private startDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(2016, 0));
    private endDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date(2017, 2));

    private stackingClick$ = new BehaviorSubject<null>(null);
    private stacking$: Observable<string> = this.stackingClick$
                                                .scan(x => !x, true)
                                                .map(x => x ? 'normal' : null);

    constructor(private http: Http, private categorySvc: CategoryModelRelayService) {
        Observable.combineLatest(this.categories$, this.monthlyStats$, this.rawChart$, this.startDate$, this.endDate$, this.stacking$)
                  .subscribe(tup => this.refreshChartData(tup[0], tup[1], tup[2], tup[3], tup[4], tup[5]));

        // Observable.combineLatest(this.rawChart$, this.stacking$)
        //           .subscribe(tup => this.setStacking(tup[0], tup[1]));

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

    toggleStacking(): void {
        this.stackingClick$.next(null);
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

    refreshChartData(categories: Category[], stats: StatItem[], chart: Chart, startDate: Date, endDate: Date, stacking: string): void {
        let visibility = {};
        chart.series.forEach(s => visibility[s.name] = s.visible);
        let series = categories.map(c => ({
            name: c.shortName,
            data: this.collectStats(c, stats, startDate, endDate),
            visible: visibility[c.shortName] ? true : false,
            stacking: stacking
        }));
        if (Object.keys(visibility).length == 0) { series[0].visible = true}

        this.clearChart(chart);
        this.setChartLabels(chart, startDate, endDate);
        let series0 = [series[0], series[1]];
        series.forEach(s => chart.addSeries(s, false));
        chart.redraw();
    }

    collectStats(category: Category, stats: StatItem[], startDate: Date, endDate: Date): StatData[] {
        let y1 = startDate.getFullYear();
        let m1 = startDate.getMonth() + 1;
        let y2 = endDate.getFullYear();
        let m2 = endDate.getMonth() + 1;

        let relevantStats = stats.filter(s => {
            let d = new Date(s._id.year, s._id.month - 1, 15);
            let inRange = startDate <= d && d <= endDate;
            return inRange && this.getCategories(s).includes(category.id())
        });
        return relevantStats.map(s => <[string,number]>[this.yearMonth(s._id.year, s._id.month - 1), s.sum * -1])
    }

    getCategories(s: StatItem): string[] {
        if (s._id.categories == null) {
            return [];
        } else {
            return s._id.categories;
        }
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

        while (y < y2 || (y == y2 && m <= m2)) {
            labels.push(this.yearMonth(y, m++));
            if (m == 12) {
                m = 0;
                y++;
            }
        }

        return labels;
    }

    setStacking(chart: Chart, stacking: string): void {
        chart.series.forEach(s => s.update({stacking: stacking}));
        chart.redraw();
    }

    clearChart(chart: Chart): void {
        while (chart.series.length > 0)
            chart.series[0].remove(true);
    }

    chartOptions: any = {
        chart: {
            type: 'column',
            zoomType: 'x',
            height: 500
        },
        title: {text: 'simple chart'},
        xAxis: {
            type: 'category',
            categories: ["a", "b", "c", "d", "e"],
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

type StatData = [string,number];

type StatItem = {
    _id: {
        year: number
        month: number
        categories: string[]
    }
    sum: number
};
