import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire} from 'angularfire2';

bootstrap(AppComponent, [
  FIREBASE_PROVIDERS,
  defaultFirebase('https://jaysicks-sample2.firebaseio.com')
]);
