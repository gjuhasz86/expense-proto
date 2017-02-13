export class Category implements Cloneable, HasId {
    public parent: Category;
    public children: Category[] = [];
    public name: string = "";

    constructor(private readonly _id: string,
                public readonly shortName: string,
                public readonly parentId: string,
                public readonly owner: string) { }

    id(): string {
        return this._id;
    }

    clone(): any {
        return {
            _id: this._id,
            shortName: this.shortName,
            parentId: this.parentId,
            owner: this.owner
        }
    }

    static of(shortName: string) {
        return Category.of2(shortName, null);
    }

    static of2(shortName: string, parentId: string) {
        return new Category(null, shortName, parentId, "");
    }

    static parse(json: any) {
        let pId = json.parentId && json.parentId != "" ? json.parentId : null;
        return new Category(
            json._id,
            json.shortName,
            pId,
            json.owner);
    }
}
