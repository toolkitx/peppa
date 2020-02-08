import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'labelValue'
})
export class LabelValuePipe implements PipeTransform {

    transform(items: string[] | {label: string; value: string; }[],
              arg: {label: string; value: string; } = {label: 'label', value: 'value'}): {label: string; value: string; }[] {
        if (!items || !items!.length) {
            return [];
        }
        const rs = [];
        (<any[]>items).map((item: any) => {
            if (typeof item === 'string') {
                rs.push({label: item, value: item});
            } else if (item[arg.label]) {
                rs.push({label: item[arg.label], value: item[arg.value]});
            }
        });
        return rs;
    }

}
