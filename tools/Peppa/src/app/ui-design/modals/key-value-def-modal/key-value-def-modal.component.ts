import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { CacheService } from '../../../cache/cache.service';
import { KeysPipe } from '../../../pipes/keys.pipe';

@Component({
    selector: 'app-key-value-def-modal',
    templateUrl: './key-value-def-modal.component.html',
    styleUrls: ['./key-value-def-modal.component.less']
})
export class KeyValueDefModalComponent implements OnInit {
    @Input() data: {[key: string]: string};
    @Input() valueType: 'string' | 'json' = 'string';
    form: FormArray;

    constructor(private cacheService: CacheService, private fb: FormBuilder, private keysPipe: KeysPipe) {
    }

    get value() {
        const value: {key: string; value: string}[] = this.form.value || [];
        const res: {[key: string]: string} = {};
        if (value.length) {
            value.map((x) => {
                if (x.key && x.value) {
                    res[x.key] = this.valueType === 'json' ? JSON.parse(x.value) : x.value;
                }
            });
            return res;
        }
        return null;
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        const keyValPairs = this.keysPipe.transform(this.data || {});
        const arrForm = this.fb.array([]);
        keyValPairs.map((item) => {
            arrForm.push(this.getFormGroup(item.key, this.valueType === 'json' ? JSON.stringify(item.value) : item.value));
        });
        this.form = arrForm;
    }

    appendItem() {
        this.form.push(this.getFormGroup(null, null));
    }

    removeItem(i: number) {
        this.form.removeAt(i);
    }

    private getFormGroup(key: string, val: string) {
        const fg = this.fb.group({});
        fg.addControl('key', this.fb.control(key));
        fg.addControl('value', this.fb.control(val));
        return fg;
    }
}
