import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RuleColumn } from '../models';

@Component({
    selector: 'qui-naming-rule-preview',
    templateUrl: './naming-rule-preview.component.html',
    styleUrls: ['./naming-rule-preview.component.less']
})
export class NamingRulePreviewComponent implements OnInit, OnChanges {
    @Input() data: string;
    @Input() disabled: boolean;
    @Input() editable: boolean;
    @Output() toggle = new EventEmitter<boolean>();
    fields: RuleColumn[];
    preview: string;
    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.fields = this.data ? JSON.parse(this.data) : [];
        this.initPreview();
    }

    initPreview() {
        const rs: string[] = [];
        this.fields.map(x => {
            let item: string;
            switch (x.dataType) {
                case 'FixedField':
                case 'Connector':
                    item = <string>x.value;
                    break;
                default:
                    item = `<${x.description}>`;
                    break;
            }
            rs.push(item);
        });
        this.preview = rs.join('');
    }

    showCtrl() {
        this.toggle.emit(true);
    }
}
