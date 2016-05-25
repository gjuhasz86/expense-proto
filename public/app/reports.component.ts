import {Component, OnInit} from "@angular/core";
import {TransactionService, AccountService} from "./crud.service";
import {CHART_DIRECTIVES} from 'angular2-highcharts';
import {ReportsService} from "./reports.service";
import {Observable} from "rxjs/Observable";
import * as _ from "underscore"
import {Account} from "./account";

@Component({
    selector: 'reports',
    templateUrl: 'app/reports.component.html',
    directives: [CHART_DIRECTIVES]
})
export class ReportsComponent implements OnInit {

    monthly:Observable<any>;
    total:Observable<any>;

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService,
                private _rptService:ReportsService) {
    }

    options:Object = {};
    debug:string = "";

    ngOnInit() {
        this.monthly = this._rptService.getMonthly().combineLatest(this._accService.getAllItemsCached())
            .map((results:any)=> {
                let stats:any = results[0];
                let accs:Account[] = results[1];
                let chartSeries = _.chain(stats)
                    .groupBy((x:any) => x._id.accountId)
                    .map((items, accId:string)=> {
                        let acc:Account = this.getAccount(accId, accs);

                        let r = _.chain(items)
                            .map((x:any)=> {
                                return {date: Date.UTC(x._id.year, x._id.month, x._id.day), amount: x.sum};
                            })
                            .sortBy(x=>x.date)
                            .value();

                        let data = this.calcRunning(r, acc.initialBalance)
                            .map(b=>[b.date, b.amount]);
                        return {name: acc.name, data: data};
                    })
                    .value();

                let series = JSON.parse(JSON.stringify(chartSeries));
                return {
                    title: {text: 'Account balance'},
                    xAxis: {
                        type: 'datetime'
                    },
                    series: series
                }
            });
        this.monthly.subscribe(x=> this.options = x);

        this.total = this._rptService.getTotal().combineLatest(this._accService.getAllItemsCached())
            .map((results:any)=> {
                let items:any = results[0];
                let accs:Account[] = results[1];

                let initial = _.chain(accs)
                    .map(x=>x.initialBalance)
                    .reduce((a, b)=>a + b, 0)
                    .value();

                let r = _.chain(items)
                    .map((x:any)=> {
                        return {date: Date.UTC(x._id.year, x._id.month, x._id.day), amount: x.sum};
                    })
                    .sortBy(x=>x.date)
                    .value();

                let data = this.calcRunning(r, initial)
                    .map(b=>[b.date, b.amount]);
                let chartSeries = {name: "Total", data: data};

                let series = JSON.parse(JSON.stringify(chartSeries));
                return {
                    title: {text: 'Total balance'},
                    xAxis: {
                        type: 'datetime'
                    },
                    series: [series]
                }
            });
        this.total.subscribe(x=> this.options2 = x);

        this._accService.refresh();
        this._rptService.refresh();
    }


    private getAccount(id:string, accs:Account[]):Account {
        return _.chain(accs)
            .find(a=>id == a._id)
            .value();
    }

    private calcRunning(items, initial) {
        return _.chain(items)
            .reduce((memo:any, item:any)=> {
                let total = memo.total + item.amount;
                item.amount = total;
                memo.total = total;
                memo.balance.push(item);
                return memo;
            }, {total: initial, balance: []})
            .value().balance;
    }

    refresh() {
        this._tnxService.refresh();
    }

    options2:Object = {
        "title": {
            "text": "simple chart"
        },
        "xAxis": {
            "type": "datetime"
        },
        "series": {
            "name": "Total",
            "data": [
                [
                    1435017600000,
                    1581179
                ],
                [
                    1466380800000,
                    1252052
                ]
            ]
        }
    }
}