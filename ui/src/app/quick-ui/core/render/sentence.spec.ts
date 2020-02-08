import { inject, TestBed } from '@angular/core/testing';
import { CacheService } from '../cache/cache.service';
import { Injector } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Sentence } from './sentence';
import { LocationRef } from './location-ref.service';

describe('Sentence', () => {
    let cacheService: CacheService;
    let injector: Injector;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([])],
            providers: [
                Injector,
                CacheService,
                {provide: LocationRef, useValue: {protocol: 'https:', host: 'mock-host'}},
                {provide: ActivatedRoute, useValue: { snapshot: {fragment: 'id_token=mock-fragment', queryParams: {id: 'mock-id'}} }}
            ]
        });
        cacheService = TestBed.get(CacheService);
        cacheService.set('mockKey', 'mockValue');
        injector = TestBed.get(Injector);
    });

    describe('$value', () => {
        it('should return $value', () => {
            const instance = new Sentence(injector, '$value', 'mock');
            expect(instance.valid);
            expect(instance.value).toEqual('mock');
        });

        it('should translate template \'name = "$value"\'', () => {
            const instance = new Sentence(injector, 'name = "$value"', 'mock');
            expect(instance.valid);
            expect(instance.value).toEqual('name = "mock"');
        });

    });

    describe('$cache', () => {
        it('should return $cache(mockKey)', () => {
            const instance = new Sentence(injector, '$cache(mockKey)');
            expect(instance.valid);
            expect(instance.value).toEqual('mockValue');
        });
    });

    describe('$view', () => {
        it('should return /login for $view(login)', () => {
            const instance = new Sentence(injector, '$view(login)');
            expect(instance.valid);
            expect(instance.value).toEqual('/login');
        });

        it('should return /login?id=mockId for $view(login, {id: \'mockId\'})', () => {
            const instance = new Sentence(injector, '$view(login, {id: \'mockId\'})');
            expect(instance.valid);
            expect(instance.value).toEqual('/login?id=mockId');
        });
    });

    describe('$popup', () => {
        it('should return /login for $popup(edit)', () => {
            const instance = new Sentence(injector, '$popup(edit)');
            expect(instance.valid);
            expect(instance.view).toEqual({name: 'edit', params: {}});
        });

        it('should return /login for $popup(delete-category, {ok: \'reload\'})', () => {
            const instance = new Sentence(injector, '$popup(delete-category, {ok: \'reload\'})');
            expect(instance.valid);
            expect(instance.view).toEqual({name: 'delete-category', params: {ok: 'reload'}});
        });
    });

    describe('$context', () => {
        it('should return $context($filter)', () => {
            const instance = new Sentence(injector, '$context($filter)', null, {$filter: 'mockFilters'});
            expect(instance.valid);
            expect(instance.value).toEqual('mockFilters');
        });
    });

    describe('$form', () => {
        it('should return $form(name)', () => {
            const instance = new Sentence(injector, '$form(name)', null, null, {name: 'mockName'});
            expect(instance.valid);
            expect(instance.value).toEqual('mockName');
        });
    });

    describe('$location', () => {
        it('should return $location(login)', () => {
            const instance = new Sentence(injector, '$location(login)');
            expect(instance.valid);
            expect(instance.value).toEqual('https://mock-host/login');
        });
    });

    describe('$query', () => {
        it('should return $query(id)', () => {
            const instance = new Sentence(injector, '$query(id)');
            expect(instance.valid);
            expect(instance.value).toEqual('mock-id');
        });
    });

    describe('$fragment', () => {
        it('should return $fragment(id_token)', () => {
            const instance = new Sentence(injector, '$fragment(id_token)');
            expect(instance.valid);
            expect(instance.value).toEqual('mock-fragment');
        });
    });
});
