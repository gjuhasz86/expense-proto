import {Injectable} from "@angular/core";
import {CrudReqService} from "../common/crud-req.service";
import {ErrorLoggerService} from "../common/error-logger.service";
import {Http} from "@angular/http";
import {Category} from "./category";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CategoryReqService extends CrudReqService<Category> {

    constructor(_http: Http,
                _errLog: ErrorLoggerService) {
        super('categories', _http, _errLog);
    }

    list(): Observable<Category[]> {
        return super.list().map(cats => {
            let catMap: {[id: string]: Category;} = CategoryReqService.idMap(cats);
            return cats
                .map(cat => CategoryReqService.inflateOne(cat, catMap))
                .map((cat: Category) => {
                    console.log("genname01");
                    console.log(cat);
                    return CategoryReqService.genName(cat);
                });
        })
    }


    parse(json: any): Category {
        return Category.parse(json);
    }

    private static idMap(categories: Category[]): {[id: string]: Category;} {
        let res: {[id: string]: Category;} = {};
        categories.forEach(cat => res[cat.id()] = cat);
        return res;
    }

    private static inflateOne(cat: Category, categories: {[id: string]: Category;}): Category {
        let parent: Category = categories[cat.parentId];
        cat.parent = parent;
        if (parent != undefined) {
            console.log('inflating parent');
            console.log(parent);
            parent.children.push(cat);
        }
        return cat;
    }

    public static genName(cat: Category): Category {
        if (!cat.name) {
            if (cat.parent) {
                this.genName(cat.parent);
                cat.name = `${cat.parent.name} > ${cat.shortName}`;
            } else {
                cat.name = cat.shortName;
            }
        }
        return cat;
    }
}
