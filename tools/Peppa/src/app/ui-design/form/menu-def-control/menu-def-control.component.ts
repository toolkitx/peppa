import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDefControl } from '../custom-def-control';
import { MenuDef } from '../../../modals/ui-configuration';
import { NzModalService } from 'ng-zorro-antd';
import { MenuDefModalComponent } from '../../modals/menu-def-modal/menu-def-modal.component';
import { JsonLoaderService } from '../../../providers/json-loader.service';

@Component({
    selector: 'app-menu-def-control',
    templateUrl: './menu-def-control.component.html',
    styleUrls: ['./menu-def-control.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MenuDefControlComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => MenuDefControlComponent),
        multi: true
    }]
})
export class MenuDefControlComponent extends CustomDefControl<MenuDef[]> implements OnInit {
    @Input() preview = true;
    @Input() allowGroup = true;
    iconNames: string[] = [];

    constructor(protected injector: Injector, private nzModalService: NzModalService, private jsonLoader: JsonLoaderService) {
        super(injector);
    }

    async ngOnInit() {
        const iconPath = 'assets/edc-icons.json';
        const icons = this.cacheService.get<string[]>(iconPath);
        if (!icons) {
            await this.jsonLoader.get(iconPath).subscribe((data: {icons: {[name: string]: string}[]}) => {
                this.iconNames = data.icons.map(x => x.name) || [];
                this.cacheService.set(iconPath, this.iconNames);
            });
        } else {
            this.iconNames = icons;
        }
    }

    toggleVisible() {
        const modal = this.nzModalService.create({
            nzTitle: 'Edit action menus',
            nzContent: MenuDefModalComponent,
            nzWidth: '80%',
            nzMaskClosable: false,
            nzComponentParams: {
                data: this.instanceValue ? [...this.instanceValue] : this.instanceValue,
                allowGroup: this.allowGroup,
                icons: this.iconNames
            },
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: (comp: MenuDefModalComponent) => {
                        this.instanceValue = [...comp.value];
                        this.onChangeCallback(this.instanceValue);
                        modal.close();
                    }
                },
                {
                    label: 'Cancel',
                    onClick: () => {
                        modal.close();
                    }
                }
            ]
        });
    }
}
