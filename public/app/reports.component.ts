import {Component, OnInit} from "@angular/core";
import {TransactionService, AccountService} from "./crud.service";
import {CHART_DIRECTIVES} from 'angular2-highcharts';
import {ReportsService} from "./reports.service";
import {Observable} from "rxjs/Observable";
import * as _ from "underscore"

@Component({
    selector: 'reports',
    templateUrl: 'app/reports.component.html',
    directives: [CHART_DIRECTIVES]
})
export class ReportsComponent implements OnInit {

    daily:Observable<any>;

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService,
                private _rptService:ReportsService) {
        this.options = {
            title: {text: 'simple chart'},
            xAxis: {
                type: 'datetime'
            },
            series: [{
                name: "acc1",
                data: [
                    [Date.UTC(2015, 5, 10), 28],
                    [Date.UTC(2015, 5, 11), 15],
                    [Date.UTC(2015, 5, 13), 31]]
            }, {
                name: "acc2",
                data: [
                    [Date.UTC(2015, 5, 10), 29],
                    [Date.UTC(2015, 5, 11), 13],
                    [Date.UTC(2015, 5, 13), 32]]
            }]
        };

    }

    options:Object;

    ngOnInit() {
        this.daily = this._rptService.getMonthly()
            .map((x:any)=> {
                let chartSeries = _.chain(x)
                    .groupBy((x:any) => x._id.accountId)
                    .map((items, acc)=> {
                        let r = _.chain(items)
                            .map((x:any)=> {
                                return {date: Date.UTC(x._id.year, x._id.month, 1), amount: x.sum};
                            })
                            .sortBy(x=>x.date)
                            .reduce((memo:any, item:any)=> {
                                let total = memo.total + item.amount;
                                item.amount = total;
                                memo.total = total;
                                memo.balance.push(item);
                                return memo;
                            }, {total: 0, balance: []})
                            .value();

                        let data = _.chain(r.balance).map(b=>[b.date, b.amount]).value();
                        return {name: acc, data: data};
                    })
                    .value();

                let series = JSON.parse(JSON.stringify(chartSeries));
                return {
                    title: {text: 'simple chart'},
                    xAxis: {
                        type: 'datetime'
                    },
                    series: series
                }
            });
        this.daily.subscribe(x=>this.options = x);
        this._rptService.refresh();
    }

    refresh() {
        this._tnxService.refresh();
    }
}