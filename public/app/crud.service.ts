import {Injectable, EventEmitter} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Transaction} from "./transactions/transaction";
import 'rxjs/Rx';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Account} from "./accounts/account";
import {Category} from "./categories/category";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/bufferTime';

@Injectable()
abstract class CrudService<T> {
    protected events: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _headers: Headers;
    private allItems: ReplaySubject<T[]> = new ReplaySubject<T[]>(1);
    private deleteStream: EventEmitter<T> = new EventEmitter<T>();

    constructor(private collection: String, private autoInit: boolean, protected _http: Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this.getAllItems().subscribe(res=> this.allItems.next(res));
        if (autoInit) {
            this.refresh();
        }

        this.deleteStream
            .bufferTime(500)
            .filter(x=>x.length != 0)
            .subscribe(t=> {
                this.deleteMany(t);
            });
    }

    abstract parse(json: any): T;

    refresh(): void {
        this.events.next(true);
    }

    getAllItems(): Observable<T[]> {
        return this.events
            .debounceTime(100)
            .map(x=>`/api/${this.collection}/list`)
            .flatMap((url: string) => this._http.post(url, "{}", {headers: this._headers}))
            .map((res: Response) => {
                console.log(`Populating ${this.collection}`);
                return res.json().map(this.parse);
            });
    }

    getAllItemsCached(): Observable<T[]> {
        return this.allItems;
    }

    getCount(): Observable<number> {
        return this.events.map(x=>`/api/${this.collection}/size`)
            .flatMap((url: string) => this._http.get(url))
            .map((res: Response) => res.json())
            .map(res=> {
                return res.count
            })
    }

    saveItem(json: T): void {
        console.log(`calling ${this.collection} save`);

        let item = this.parse(json);
        this._http
            .post(`/api/${this.collection}/save`, JSON.stringify(item), {headers: this._headers})
            .map(res =>res.json())
            .subscribe(res => {
                this.refresh();
            }, error => {
                console.log(error);
            });
    }

    updateItem(json: T): void {
        let item = this.parse(json);
        console.log(`calling ${this.collection} update ` + (<any>item)._id);

        this._http
            .post(`/api/${this.collection}/update`, JSON.stringify(item), {headers: this._headers})
            .subscribe(res => {
                console.log("UPDATE Response came!!!");
                console.log(res);
                this.refresh();
            }, error => {
                console.log("UPDATE ERROR came!!!");
                console.log(error);
            });
    }

    deleteItem(json: T): void {
        console.log(`calling ${this.collection} delete ` + (<any>json)._id);

        let obj = {_id: (<any>json)._id};
        this._http
            .post(`/api/${this.collection}/delete`, JSON.stringify(obj), {headers: this._headers})
            .subscribe(res => {
                console.log("DELETE Response came!!!");
                console.log(res);
                this.refresh();
            }, error => {
                console.log("DELETE ERROR came!!!");
                console.log(error);
            });
    }

    sendDelete(json: T): void {
        this.deleteStream.emit(json);
    }

    deleteMany(json: T[]): void {
        console.log(`calling ${this.collection} deleteMany [${json.length}]`);

        let ids = json.map(t=>this.getId(t));
        this._http
            .post(`/api/${this.collection}/deletemany`, JSON.stringify(ids), {headers: this._headers})
            .subscribe(res => {
                console.log("DELETE Response came!!!");
                console.log(res);
                this.refresh();
            }, error => {
                console.log("DELETE ERROR came!!!");
                console.log(error);
            });
    }

    abstract getId(t: T): string;
}

abstract class TransactionLikeService extends CrudService<Transaction> {
    constructor(private _collection: string, private _autoInit: boolean, protected _http: Http) {
        super(_collection, _autoInit, _http);
    }

    getPage(page: Observable<number>, limit: number, sortBy: string, order: string, account: string, description: string, category: string, categoryFilterOn: Boolean): Observable<Transaction[]> {
        let source = Observable.combineLatest(page, this.events.startWith(true));
        return source.map(ev=> {
            let page = ev[0];
            let skip = limit * (page - 1);

            let qSkip = `skip=${skip}`;
            let qLimit = `limit=${limit}`;
            let qSort = `sort=${sortBy}`;
            let qOrder = `order=${order}`;
            let qAccount = account == "" ? "" : `account=${account}`;
            let qDesc = description == undefined ? "" : `description=${description}`;
            let qCategory = categoryFilterOn ? `category=${category}` : "";
            return `/api/${this._collection}/search?${qSkip}&${qLimit}&${qSort}&${qOrder}&${qAccount}&${qDesc}&${qCategory}`
        })
            .flatMap((url: string) => this._http.get(url))
            .map((res: Response) => res.json().map(this.parse));
    }

    getSize(page: Observable<number>, limit: number, sortBy: string, order: string, account: string, description: string, category: string, categoryFilterOn: Boolean): Observable<number> {
        let source = Observable.combineLatest(page, this.events.startWith(true));
        return source.map(ev=> {
            let page = ev[0];
            let skip = limit * (page - 1);

            let qSkip = `skip=${skip}`;
            let qLimit = `limit=${limit}`;
            let qSort = `sort=${sortBy}`;
            let qOrder = `order=${order}`;
            let qAccount = account == "" ? "" : `account=${account}`;
            let qDesc = description == undefined ? "" : `description=${description}`;
            let qCategory = category == "" ? "" : `category=${category}`;
            return `/api/${this._collection}/size?${qSkip}&${qLimit}&${qSort}&${qOrder}&${qAccount}&${qDesc}&${qCategory}`
        })
            .flatMap((url: string) => this._http.get(url))
            .map((res: Response) => res.json())//.map(this.parse));
            .map(res=> res.count);
    }

    getId(t: Transaction): string {
        return t.id()
    }
}

@Injectable()
export class TransactionService extends TransactionLikeService {

    constructor(protected _http: Http) {
        super("transactions", false, _http);
    }

    parse(json: any): Transaction {
        return Transaction.parse(json);
    }
}

@Injectable()
export class ConfigService extends CrudService<any> {
    constructor(protected _http: Http) {
        super("admin/config", false, _http);
    }

    parse(json: any): any {
        return json;
    }

    getGlobalConfig(): Observable<any> {
        return this.events
            .debounceTime(100)
            .map(x=>`/public/globalconfig`)
            .flatMap((url: string) => this._http.get(url))
            .map(res =>res.json());
    }

    getId(t: any): string {
        return t._id()
    }
}

@Injectable()
export class PendingTransactionService extends TransactionLikeService {
    constructor(protected _http: Http) {
        super("pendingtnxs", false, _http);
    }

    parse(json: any): Transaction {
        return Transaction.parse(json);
    }
}

@Injectable()
export class AccountService extends CrudService<Account> {
    accountList: Account[];

    constructor(protected _http: Http) {
        super("accounts", true, _http);
        this.getAllItemsCached().subscribe(res=> {
            this.accountList = res
        });
        this.refresh();
    }

    getAccounts(): Account[] {
        console.log("returing accounts " + JSON.stringify(this.accountList));
        return this.accountList;
    }

    parse(json: any): Account {
        return Account.parse(json);
    }

    getId(t: Account): string {
        return t.id()
    }
}

@Injectable()
export class CategoryService extends CrudService<Category> {
    constructor(protected _http: Http) {
        super("categories", true, _http);
    }

    parse(json: any): Category {
        return Category.parse(json);
    }

    getAllInflatedCategories(): Observable<Category[]> {
        return this.getAllItemsCached().map(cats=> {
            console.log("inflating3");
            console.log(cats);
            let catMap: {[id: string]: Category;} = this.idMap(cats);
            return cats
                .map(cat=> {
                    cat.children = [];
                    return cat;
                })
                .map(cat=>this.inflateOne(cat, catMap))
                .map((cat: Category)=> {
                    console.log("genname01");
                    console.log(cat);
                    return this.genName(cat);
                });
        });
    }

    categoryMap(): Observable<{[id: string]: Category;}> {
        return this.getAllInflatedCategories().map(cats=> this.idMap(cats));
    }

    private idMap(categories: Category[]): {[id: string]: Category;} {
        let res: {[id: string]: Category;} = {};
        categories.forEach(cat => res[cat._id] = cat);
        return res;
    }

    private inflateOne(cat: Category, categories: {[id: string]: Category;}): Category {
        let parent: Category = categories[cat.parentId];
        cat.parent = parent;
        if (parent != undefined) {
            console.log('inflating parent');
            console.log(parent);
            parent.children.push(cat);
        }
        return cat;
    }

    public genName(cat: Category): Category {
        if (!cat.name) {
            let parentName = "";
            if (cat.parent) {
                this.genName(cat.parent);
                cat.name = `${cat.parent.name} > ${cat.shortName}`;
            } else {
                cat.name = cat.shortName;
            }
        }
        return cat;
    }

    saveItem(cat: Category): void {
        delete cat.parent;
        delete cat.children;
        super.saveItem(cat);
    }

    updateItem(cat: Category): void {
        delete cat.parent;
        delete cat.children;

        super.updateItem(cat);
    }

    getId(t: Category): string {
        return t.id()
    }
}

