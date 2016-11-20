import {CommonModelRelayService} from "./common-model-relay.service";

export abstract class CommonRelayComponent<T> {

    constructor(protected _relay: CommonModelRelayService<T>) { }

    refresh() {
        this._relay.refresh();
    }

    save(t: T) {
        this._relay.save(t);
    }

    removeId(id: string) {
        this._relay.removeId(id);
    }
}