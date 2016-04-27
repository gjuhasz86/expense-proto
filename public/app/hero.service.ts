import {Injectable, Inject} from 'angular2/core';
import {Hero} from './hero';
import {Observable} from 'rxjs/Observable';
// <reference path="../typings/browser/ambient/firebase/index.d.ts" />
import {AngularFire} from 'angularfire2';
import {FirebaseRef} from 'angularfire2';

@Injectable()
export class HeroService {
  private db:Observable<Hero[]>;
  private ref:Firebase


  constructor(private _af:AngularFire) {
    this.db = _af.database.list('/items');
    this.ref = new Firebase('https://jaysicks-sample2.firebaseio.com/');
  }

  getHeroes():Observable<Hero[]> {
    return this._af.database.list('/items');
    // return Promise.resolve(HEROES);
  }

  getHero(id:number):Hero {
    return HEROES[0];
    // return Promise.resolve(HEROES).then(
    //   heroes => heroes.filter(hero => hero.id === id)[0]
    // );
  }

  saveHero(hero:Hero):void {
    this._af.database.list('/items').push(hero)
  }

  updateHero(hero:any):void {
    this._af.database.list('/items').update(hero, {name: hero.name, score: hero.score});
  }

}

export var HEROES:Hero[] = [
  {"id": 11, "name": "Mr. Nice", "score": 42},
  {"id": 12, "name": "Narco", "score": 23},
  {"id": 13, "name": "Bombasto", "score": 16},
  {"id": 14, "name": "Celeritas", "score": 64},
  {"id": 15, "name": "Magneta", "score": 95},
  {"id": 16, "name": "RubberMan", "score": 22},
  {"id": 17, "name": "Dynama", "score": 44},
  {"id": 18, "name": "Dr IQ", "score": 23},
  {"id": 19, "name": "Magma", "score": 24},
  {"id": 20, "name": "Tornado", "score": 91}
];
