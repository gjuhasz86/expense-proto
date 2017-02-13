import {Pipe, PipeTransform} from '@angular/core';
import {Category} from "./category";

@Pipe({name: 'categoryName'}) //TODO: rename to 'toCategory'
export class CategroyNamePipe implements PipeTransform {

    transform(categoryIds: string[], categories: Category[]): Category[] {
        if (categoryIds) {
            return categories.filter(c => categoryIds.includes(c.id()));
        } else {
            return [];
        }
    }
}