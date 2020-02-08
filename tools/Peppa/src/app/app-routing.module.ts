import { HomeComponent } from './views/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandEditorComponent } from './command/command-editor/command-editor.component';
import { UiEditorComponent } from './ui-design/ui-editor/ui-editor.component';
import { DataGuard } from './guards/data.guard';
import { MockServerComponent } from './views/mock-server/mock-server.component';
import { CommandEditor2Component } from './command-design/command-editor2/command-editor2.component';

const routes: Routes = [
    {
        path: 'command-editor',
        canActivate: [DataGuard],
        component: CommandEditorComponent
    },
    {
        path: 'command-editor2',
        canActivate: [DataGuard],
        component: CommandEditor2Component
    },
    {
        path: 'ui-editor',
        canActivate: [DataGuard],
        component: UiEditorComponent
    },
    {
        path: 'mock-server',
        component: MockServerComponent
    },
    {
        path: 'home',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
