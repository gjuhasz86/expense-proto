export class Category {
    public parent: Category;
    public children: Category[] = [];
    public name: string = "";

    constructor(private readonly _id: string,
                public readonly shortName: string,
                public readonly parentId: string) { }

    public id(): string {
        return this._id;
    }

    toSimpleObj(): any {
        return {
            _id: this._id,
            shortName: this.shortName,
            parentId: this.parentId,
            name: this.name
        }
    }

    static of(shortName: string) {
        return Category.of2(shortName, null);
    }

    static of2(shortName: string, parentId: string) {
        return new Category(null, shortName, parentId);
    }

    static parse(json: any) {
        return new Category(
            json._id,
            json.shortName,
            json.parentId);
    }
}
