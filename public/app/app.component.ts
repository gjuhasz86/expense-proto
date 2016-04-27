import {Component} from 'angular2/core';
import {HeroService} from './hero.service';
import {HeroEditComponent} from "./hero-edit.component";
import {Hero} from "./hero";
import {Observable} from 'rxjs/Observable';
import {ExpenseService} from "./expense.service";
import {NewTransactionComponent} from "./new-transaction.component";
import {TransactionListComponent} from "./transaction-list.component";
import {DebugComponent} from "./debug.component";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        HeroEditComponent,
        NewTransactionComponent,
        TransactionListComponent,
        DebugComponent],
    providers: [
        HeroService,
        ExpenseService
    ]
})
export class AppComponent {
    heroes:Observable<Hero[]>;
    newHero:Hero;

    constructor(private _heroService:HeroService) {
        this.newHero = new Hero();
    }

    ngOnInit() {
        this.getHeroes();
    }

    getHeroes() {
        // this._heroService.getHeroes().then(heroes => this.heroes = heroes);
        this.heroes = this._heroService.getHeroes()
    }

}
