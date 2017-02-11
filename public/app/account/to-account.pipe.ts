import {Pipe, PipeTransform} from '@angular/core';
import {Account} from "./account";

@Pipe({name: 'toAccount'})
export class ToAccountPipe implements PipeTransform {
    transform(accountId: string, accounts: Account[]): Account {
        return accounts.find(a => a.id() == accountId)
    }
}