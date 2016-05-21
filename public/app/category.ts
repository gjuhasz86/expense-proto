export class Category {
    _id:string;
    shortName:string;
    parentId:string;
    parent:Category;
    children:Category[];
    name:string;
}