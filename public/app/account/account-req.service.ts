import {Injectable} from "@angular/core";
import {Account} from "./account";
import {CrudReqService} from "../common/crud-req.service";
import {ErrorLoggerService} from "../common/error-logger.service";
import {Http} from "@angular/http";

@Injectable()
export class AccountReqService extends CrudReqService<Account> {

    constructor(_http: Http,
                _errLog: ErrorLoggerService) {
        super('accounts', _http, _errLog);
    }

    parse(json: any): Account {
        return Account.parse(json);
    }

}
