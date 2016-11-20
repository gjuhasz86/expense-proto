export class Category {
    public parent: Category;
    public children: Category[] = [];
    public name: string = "";
    public parentId: string;

    constructor(private readonly _id: string,
                public readonly shortName: string) {}

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
        return new Category(null, shortName);
    }

    static of2(shortName: string, parentId: string) {
        let res = Category.of(shortName);
        res.parentId = parentId;
        return res;
    }

    static parse(json: any) {
        let res = new Category(
            json._id,
            json.shortName);
        res.parentId = json.parentId;
        return res;
    }
}
