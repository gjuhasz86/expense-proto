import {CommonModelRelayService} from "./common-model-relay.service";

export abstract class CommonRelayComponent<T> {

    constructor(protected relay: CommonModelRelayService<T>) { }

    refresh() {
        this.relay.refresh();
    }

    save(t: T) {
        this.relay.save(t);
    }

    update(t: T) {
        this.relay.update(t);
    }

    removeId(id: string) {
        this.relay.removeId(id);
    }
}