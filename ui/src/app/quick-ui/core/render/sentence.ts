import { CacheService } from '../cache/cache.service';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { QUI } from '../global';
import { Injectable, Injector } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { LocationRef } from './location-ref.service';

@Injectable()
export class Sentence {
    cacheService: CacheService;
    location: LocationRef;
    activatedRoute: ActivatedRoute;
    urlSerializer: UrlSerializer;
    router: Router;
    private _value: any;
    private _valid = true;
    private _type: string;
    private _context: any;
    private _viewName: string;
    private _viewParams: any;

    static get formFieldRegexp() {
        return new RegExp(/\$form\((.+?)\)/, 'g');
    }

    get value() {
        return this._value;
    }

    get type() {
        return this._type;
    }

    get valid() {
        return this._valid;
    }

    get view() {
        return {name: this._viewName, params: this._viewParams};
    }


    constructor(private injector: Injector,
                private input: string,
                private params: {[key: string]: any;} | string = {},
                private context?: any,
                private formValueObject?: any) {
        this.location = injector.get(LocationRef);
        this.cacheService = injector.get(CacheService);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.urlSerializer = injector.get(UrlSerializer);
        this.router = injector.get(Router);
        this._value = input;
        this._context = context;
        if (this.input === '$value') {
            this._value = params;
            return;
        }
        // Replace string in these format:
        // name = "$value"
        // This is a sample $value
        if (this.stringTemplateRegexp.exec(this.input)) {
            this.translateStringTemplate();
        } else if (this.locationHrefTemplateRegexp.exec(this.input)) {
            this.translateHrefTemplate();
        } else if (this.sentenceRegexp.test(this.input)) {
            this.translate();
        }
    }

    private translate() {
        try {
            let result = this.input;
            let match: any;
            const reg = this.sentenceRegexp;
            while (match = reg.exec(this.input)) {
                if (match) {
                    result = this.replaceItem(result, match[0], match[1], match[2]);
                }
            }
            this._value = result;
            this._valid = true;
        } catch (e) {
            this._valid = false;
            QUI.log(e.message);
        }
    }

    private translateStringTemplate() {
        try {
            let result = this.input;
            let match: any;
            const reg = this.stringTemplateRegexp;
            while (match = reg.exec(this.input)) {
                if (match) {
                    result = this.replaceTemplate(result, match[0], match[1]);
                }
            }
            this._value = result;
            this._valid = true;
        } catch (e) {
            this._valid = false;
            QUI.log(e.message);
        }
    }

    private translateHrefTemplate() {
        this._value = window.location.href;
        this._valid = true;
    }

    private replaceTemplate(templateStr: string, matchSection: string, optionalParams: string) {
        if (!this.params) {
            return '';
        }
        const targetValue = this.params.toString();
        if (optionalParams) {
            // TODO handle $value[0];
        }
        return templateStr.replace(matchSection, targetValue);
    }

    private get sentenceRegexp() {
        return new RegExp(/\$(location|query|cache|view|value|fragment|popup|context|form)\((.+?)\)/, 'g');
    }

    private get stringTemplateRegexp() {
        // return new RegExp(/\$value[^\(\)](\[\d+\])?/, 'g');
        // TODO handle $value[0];
        return new RegExp(/\$value/, 'g');
    }

    private get locationHrefTemplateRegexp() {
        // return location.href;
        return new RegExp(/\$href$/, 'g');
    }

    private replaceItem(inStr: string, targetOrigin: string, targetType: string, targetParam: string) {
        this._type = targetType;
        let targetValue = '';
        switch (targetType) {
            case 'location':
                this._viewName = targetParam;
                targetValue = `${this.location.protocol}//${this.location.host}/${targetParam}`;
                break;
            case 'query':
                targetValue = this.activatedRoute.snapshot.queryParams[targetParam];
                break;
            case 'fragment':
                targetValue = this.getFragment(targetParam);
                break;
            case 'cache':
                targetValue = this.cacheService.get(targetParam);
                break;
            case 'popup':
            case 'view':
                targetValue = this.readViewSentence(targetParam);
                break;
            case 'value':
                targetValue = this.getPropertyOfValue(targetParam);
                break;
            case 'form':
                targetValue = this.getPropertyOfFormValue(targetParam);
                break;
            case 'context':
                targetValue = this.getPropertyOfContext(targetParam);
                break;
        }
        return inStr === targetOrigin ? (targetValue || '') : inStr.replace(targetOrigin, targetValue || '');
    }

    private readViewSentence(sentenceParams: string) {
        const match = this.viewSentenceBreakRegexp.exec(sentenceParams);
        if (match) {
            const viewName = match[1];
            this._viewName = viewName;
            const paramObj = this.getViewSentenceParams(match[3]);
            this._viewParams = paramObj;
            const tree = this.router.createUrlTree([viewName], {queryParams: paramObj});
            return this.urlSerializer.serialize(tree);
        }
        return null;
    }

    private getFragment(fragmentKey: string) {
        const data = this.activatedRoute.snapshot.fragment;
        const obj = new HttpParams({fromString: data});
        return obj && obj.has(fragmentKey) ? obj.get(fragmentKey) : null;
    }

    private get viewSentenceBreakRegexp() {
        return /^([a-z0-9-_]+)(,\s+({.+})?)?$/g;
    }

    private getViewSentenceParams(paramStr: string) {
        const result = {};
        if (!paramStr) {
            return result;
        }
        let match: any;
        const reg = /[{|,|\s]([^",]+)\s*:\s*'([^,}]+)'/g;
        while (match = reg.exec(paramStr)) {
            if (match) {
                const key = match[1];
                const val = match[2];
                result[key] = val && /^\$.+/g.test(val) ? this.params[val.replace(/^\$/, '')] : val;
            }
        }
        return result;
    }

    private getPropertyOfValue(propertyName: string) {
        if (this.params && this.params.hasOwnProperty(propertyName)) {
            return this.params[propertyName];
        }
        return '';
    }

    private getPropertyOfFormValue(propertyName: string) {
        if (this.formValueObject && this.formValueObject.hasOwnProperty(propertyName)) {
            return this.formValueObject[propertyName];
        }
        return '';
    }

    private getPropertyOfContext(propertyName: string) {
        if (this.context && this.context.hasOwnProperty(propertyName)) {
            return this.context[propertyName];
        }
        return '';
    }
}
