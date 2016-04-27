import {Hero} from './hero';
import {HeroService} from './hero.service';
import {Component, Input} from 'angular2/core';


@Component({
  selector: 'hero-edit',
  templateUrl: 'app/hero-edit.component.html',
})
export class HeroEditComponent {
  @Input()
  hero:Hero;

  constructor(private _heroService:HeroService) {
  }

  save(hero:Hero):void {
    this._heroService.saveHero(hero)
  }

  update(hero:Hero):void {
    this._heroService.updateHero(hero)
  }
}
