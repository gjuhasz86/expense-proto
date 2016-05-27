export class Category {
    _id:string;
    shortName:string;
    parentId:string;
    parent:Category;
    children:Category[];
    name:string;

    static parse(json:any) {
        let res = new Category();
        res._id = json._id;
        res.shortName = json.shortName;
        res.parentId = json.parentId;
        res.children = [];
        return res;
    }
}