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

    constructor(private _tnxService:TransactionService,
                private _accService:AccountService,
                private _rptService:ReportsService) {
    }

    options:Object = {};

    ngOnInit() {
        this.monthly = this._rptService.getMonthly().combineLatest(this._accService.getAllItemsCached())
            .map((results:any)=> {
                let x:any = results[0];
                let accs:Account[] = results[1];
                let chartSeries = _.chain(x)
                    .groupBy((x:any) => x._id.accountId)
                    .map((items, accId)=> {
                        let acc:Account = _.chain(accs)
                            .find(a=>accId == a._id)
                            .value();

                        let r = _.chain(items)
                            .map((x:any)=> {
                                return {date: Date.UTC(x._id.year, x._id.month, x._id.day), amount: x.sum};
                            })
                            .sortBy(x=>x.date)
                            .reduce((memo:any, item:any)=> {
                                let total = memo.total + item.amount;
                                item.amount = total;
                                memo.total = total;
                                memo.balance.push(item);
                                return memo;
                            }, {total: acc.initialBalance, balance: []})
                            .value();

                        let data = _.chain(r.balance).map(b=>[b.date, b.amount]).value();
                        return {name: acc.name, data: data};
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
        this.monthly.subscribe(x=>this.options = x);
        this._accService.refresh();
        this._rptService.refresh();
    }

    refresh() {
        this._tnxService.refresh();
    }
}