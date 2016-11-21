import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {ErrorLoggerService} from "../common/error-logger.service";
import {CrudReqService} from "../common/crud-req.service";
import {Transaction} from "./transaction";

@Injectable()
export class TransactionReqService extends CrudReqService<Transaction> {

    constructor(http: Http,
                errLog: ErrorLoggerService) {
        super('transactions', http, errLog);
    }

    parse(json: Transaction): Transaction {
        return Transaction.parse(json);
    }
}