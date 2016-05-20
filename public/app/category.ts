export class Category {
    _id:string;
    shortName:string;
    parentId:string;
    childrenIds:string[];
    parents:Category[];
    children:Category[];
}