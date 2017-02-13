import {Pipe, PipeTransform} from '@angular/core';
import {Account} from "./account";

@Pipe({name: 'toAccount'})
export class ToAccountPipe implements PipeTransform {
    transform(accountId: string, accounts: Account[]): Account {
        let acc = accounts.find(a => a.id() == accountId)
        return acc ? acc : Account.of2("-NONE-", "");
    }
}