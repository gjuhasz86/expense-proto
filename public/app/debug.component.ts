import {Component, OnInit} from "angular2/core";
import {ExpenseService} from "./expense.service";
import {Observable} from "rxjs/Observable";
import {Transaction} from "./transaction";
import {Hero} from "./hero";
import {HeroService} from "./hero.service";
import {HeroEditComponent} from "./hero-edit.component";

@Component({
    selector: 'debug',
    template: `
<h1>HELLO1</h1>
<div *ngFor="#tnx of transactions | async">
{{tnx.description}} {{tnx.amount}}
</div>
<div *ngFor="#hero of heroes | async">
{{hero.name}} {{hero.score}}
</div>

<ul>
    <li *ngFor="#hero of heroes | async">
        <hero-edit [hero]="hero"></hero-edit>
    </li>
</ul>
`,
    directives: [HeroEditComponent]
})
export class DebugComponent implements OnInit {
    transactions:Observable<Transaction[]>;
    heroes:Observable<Hero[]>;

    constructor(private _expenseService:ExpenseService,
                private  _heroService:HeroService) {
    }

    ngOnInit() {
        this.getTransactions();
        this.getHeroes();
    }

    private getTransactions() {
        this.transactions = this._expenseService.getTransactions();
    }

    private getHeroes() {
        this.heroes = this._heroService.getHeroes();
    }
}