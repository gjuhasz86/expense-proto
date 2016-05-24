import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Transaction} from "./transaction";
import 'rxjs/Rx';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Account} from "./account";
import {Category} from "./category";
import 'rxjs/add/operator/debounceTime';

@Injectable()
abstract class CrudService<T> {
    private events:ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _headers:Headers;
    private allItems:ReplaySubject<T[]> = new ReplaySubject<T[]>(1);

    constructor(private collection:String, protected _http:Http) {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
        this.getAllItems().subscribe(res=> this.allItems.next(res));
    }

    abstract parse(json:any):T[];

    refresh():void {
        this.events.next(true);
    }

    getAllItems():Observable<T[]> {
        return this.events
            .debounceTime(100)
            .map(x=>`/api/${this.collection}/list`)
            .flatMap((url:string) => this._http.post(url, "{}", {headers: this._headers}))
            .map((res:Response) => {
                console.log(`Populating ${this.collection}`);
                return this.parse(res.json())
            });
    }

    getAllItemsCached():Observable<T[]> {
        return this.allItems;
    }

    getCount():Observable<number> {
        return this.events.map(x=>`/api/${this.collection}/size`)
            .flatMap((url:string) => this._http.get(url))
            .map((res:Response) => res.json())
            .map(res=> {
                return res.count
            })
    }


    getPage(page:Observable<number>, limit:number, sortBy:string, order:string):Observable<T[]> {
        let source = Observable.combineLatest(page, this.events.startWith(true));
        return source.map(ev=> {
            let page = ev[0];
            let skip = limit * (page - 1);
            return `/api/${this.collection}/search?skip=${skip}&limit=${limit}&sort=${sortBy}&order=${order}`
        })
            .flatMap((url:string) => this._http.get(url))
            .map((res:Response) => this.parse(res.json()));
    }

    saveItem(tnx:T):void {
        console.log(`calling ${this.collection} save`);

        this._http
            .post(`/api/${this.collection}/save`, JSON.stringify(tnx), {headers: this._headers})
            .map(res =>res.json())
            .subscribe(res => {
                console.log("Response came!!!");
                console.log(res);
                this.refresh();
            }, error => {
                console.log("ERROR came!!!");
                console.log(error);
            });
    }

    updateItem(tnx:T):void {
        console.log(`calling ${this.collection} update ` + (<any>tnx)._id);

        this._http
            .post(`/api/${this.collection}/update`, JSON.stringify(tnx), {headers: this._headers})
            .subscribe(res => {
                console.log("UPDATE Response came!!!");
                console.log(res);
                this.refresh();
            }, error => {
                console.log("UPDATE ERROR came!!!");
                console.log(error);
            });
    }

    deleteItem(tnx:T):void {
        console.log(`calling ${this.collection} delete ` + (<any>tnx)._id);

        let obj = {_id: (<any>tnx)._id};
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
}

@Injectable()
export class TransactionService extends CrudService<Transaction> {
    constructor(protected _http:Http) {
        super("transactions", _http);
    }

    parse(json:any[]):Transaction[] {
        return json.map(t => Transaction.parse(t));
    }
}

@Injectable()
export class AccountService extends CrudService<Account> {
    constructor(protected _http:Http) {
        super("accounts", _http);
    }

    parse(json:any[]):Account[] {
        return json.map(t => Account.parse(t));
    }
}

@Injectable()
export class CategoryService extends CrudService<Category> {
    constructor(protected _http:Http) {
        super("categories", _http);
    }

    parse(json:any[]):Category[] {
        return json.map(t => Category.parse(t));
    }

    getAllInflatedCategories():Observable<Category[]> {
        return this.getAllItemsCached().map(cats=> {
            console.log("inflating3");
            console.log(cats);
            let catMap:{[id:string]:Category;} = this.idMap(cats);
            return cats
                .map(cat=> {
                    cat.children = [];
                    return cat;
                })
                .map(cat=>this.inflateOne(cat, catMap))
                .map((cat:Category)=> {
                    console.log("genname01");
                    return this.genName(cat);
                });
        });
    }

    private idMap(categories:Category[]):{[id:string]:Category;} {
        let res:{[id:string]:Category;} = {};
        categories.forEach(cat => res[cat._id] = cat);
        return res;
    }

    private inflateOne(cat:Category, categories:{[id:string]:Category;}):Category {
        let parent:Category = categories[cat.parentId];
        cat.parent = parent;
        if (parent != undefined) {
            console.log('inflating parent');
            console.log(parent);
            parent.children.push(cat);
        }
        return cat;
    }

    public genName(cat:Category):Category {
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

    saveItem(cat:Category):void {
        delete cat.parent;
        delete cat.children;
        super.saveItem(cat);
    }

    updateItem(cat:Category):void {
        delete cat.parent;
        delete cat.children;

        super.updateItem(cat);
    }
}

