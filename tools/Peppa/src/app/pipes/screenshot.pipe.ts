import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'screenshot'
})
export class ScreenshotPipe implements PipeTransform {

    transform(type: string): string {
        return `assets/screenshots/${type}.png`;
    }

}
