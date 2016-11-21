import {CommonModelRelayService} from "./common-model-relay.service";

export abstract class CommonRelayComponent<T> {

    constructor(protected relay: CommonModelRelayService<T>) { }

    refresh() {
        this.relay.refresh();
    }

    save(t: T) {
        this.relay.save(t);
    }

    removeId(id: string) {
        this.relay.removeId(id);
    }
}