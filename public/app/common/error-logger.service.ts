import {Injectable} from "@angular/core";

@Injectable()
export class ErrorLoggerService {
    log(msg: string, err: any) {
        console.error(msg);
        console.error(err);
    }
}