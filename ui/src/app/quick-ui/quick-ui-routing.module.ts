import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewGeneratorComponent } from './core/render/view-generator/view-generator.component';
import { PermissionGuard } from './core/guard/permission.guard';

const routes: Routes = [
    {
        path: 'login', redirectTo: 'display/login'
    },
    {
        path: 'register', redirectTo: 'display/register'
    },
    {
        path: 'display', redirectTo: 'display/home'
    },
    {
        path: `display/:viewName`, canActivate: [PermissionGuard], component: ViewGeneratorComponent
    },
    {path: '', redirectTo: 'display/home', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuickUIRoutingModule {
}
