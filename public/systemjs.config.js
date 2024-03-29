/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/',
            'underscore': 'node_modules/underscore/underscore.js'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'js',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
            // other libraries
            'rxjs': 'npm:rxjs',
            'ng2-bootstrap': 'node_modules/ng2-bootstrap/bundles/ng2-bootstrap.umd.js',
            'moment': 'node_modules/moment/moment.js',
            'ng2-completer': 'node_modules/ng2-completer/ng2-completer.umd.js',
            'angular2-highcharts': 'npm:angular2-highcharts',
            'highcharts': 'npm:highcharts',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'angular2-highcharts': {
                main: './index.js',
                defaultExtension: 'js'
            },
            'highcharts': {
                // NOTE: You should set './highcharts.src.js' here
                // if you are not going to use <chart type="StockChart"
                main: './highstock.src.js',

                defaultExtension: 'js'
            }
        }
    });
})(this);
