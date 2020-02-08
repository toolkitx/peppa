import { PQL } from './pql';

describe('PQL', () => {
    describe('String to Filter Object', () => {

        it('should convert "field = "value"" to filter object', () => {
            const pql = new PQL('field = "value"');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: '=', value: 'value'}]);
        });

        it('should "field = "value be invalid" to filter object', () => {
            const pql = new PQL('field = "value');
            expect(pql.valid).toBeFalsy();
        });

        it('should convert "field != "value"" to filter object', () => {
            const pql = new PQL('field != "value"');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: '!=', value: 'value'}]);
        });

        it('should convert "field ~ "value"" to filter object', () => {
            const pql = new PQL('field ~ "value"');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: '~', value: 'value'}]);
        });

        it('should convert "field in ("Private", "Public")" to filter object', () => {
            const pql = new PQL('field in ("Private", "Public")');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: 'in', value: ['Private', 'Public']}]);
        });

        it('should convert "field in (1, 2)" to filter object', () => {
            const pql = new PQL('field in (1, 2)');
            expect(pql.valid).toBeFalsy();
        });

        it('should convert "field between (1, 2)" to filter object', () => {
            const pql = new PQL('field between (1, 2)');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: 'between', value: ['1', '2']}]);
        });

        it('should convert "field between (null, 2)" to filter object', () => {
            const pql = new PQL('field between (null, 2)');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: 'between', value: ['', '2']}]);
        });

        it('should convert "field between (1, null)" to filter object', () => {
            const pql = new PQL('field between (1, null)');
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual([{field: 'field', operator: 'between', value: ['1', '']}]);
        });

        it('should convert "field in ("Private", "Public")" to filter object', () => {
            const pql = new PQL('field between ("Private", "Public")');
            expect(pql.valid).toBeFalsy();
        });

        it('should connect with AND', () => {
            const input = [
                'name ~ "TEST"',
                'privacy in ("Private", "Public")',
                'categoryId = "id1"',
                'state != "Pending"',
                'count between (10, 30)',
                'created between (null, 111)'
            ];
            const pql = new PQL(input.join(' AND '));
            const mockResult = [
                {field: 'name', operator: '~', value: 'TEST'},
                {field: 'privacy', operator: 'in', value: ['Private', 'Public']},
                {field: 'categoryId', operator: '=', value: 'id1'},
                {field: 'state', operator: '!=', value: 'Pending'},
                {field: 'count', operator: 'between', value: ['10', '30']},
                {field: 'created', operator: 'between', value: ['', '111']} // null will be converted to empty string
            ];
            expect(pql.valid).toBeTruthy();
            expect(pql.toFilterObject()).toEqual(mockResult);
        });
    });
    describe('Filter object to PQL', () => {
        it('should convert {field: \'name\', operator: \'~\', value: \'TEST\'}', () => {
            const pql = PQL.fromPQLFilters([{field: 'name', operator: '~', value: 'TEST'}]);
            expect(pql).toEqual('name ~ "TEST"');
        });

        it('should convert {field: \'name\', operator: \'=\', value: \'TEST\'}', () => {
            const pql = PQL.fromPQLFilters([{field: 'name', operator: '=', value: 'TEST'}]);
            expect(pql).toEqual('name = "TEST"');
        });

        it('should convert {field: \'name\', operator: \'!=\', value: \'TEST\'}', () => {
            const pql = PQL.fromPQLFilters([{field: 'name', operator: '!=', value: 'TEST'}]);
            expect(pql).toEqual('name != "TEST"');
        });

        it('should convert {field: \'privacy\', operator: \'in\', value: [\'Private\', \'Public\']}', () => {
            const pql = PQL.fromPQLFilters([{field: 'privacy', operator: 'in', value: ['Private', 'Public']}]);
            expect(pql).toEqual('privacy in ("Private", "Public")');
        });

        it('should convert {field: \'privacy\', operator: \'in\', value: [\'Single\']}', () => {
            const pql = PQL.fromPQLFilters([{field: 'privacy', operator: 'in', value: ['Single']}]);
            expect(pql).toEqual('privacy in ("Single")');
        });

        it('should convert {field: \'privacy\', operator: \'in\', value: \'\'}', () => {
            const pql = PQL.fromPQLFilters([{field: 'privacy', operator: 'in', value: ''}]);
            expect(pql).toEqual('');
        });

        it('should convert {field: \'count\', operator: \'between\', value: [\'10\', \'30\']}}', () => {
            const pql = PQL.fromPQLFilters([{field: 'count', operator: 'between', value: ['10', '30']}]);
            expect(pql).toEqual('count between (10, 30)');
        });

        it('should convert {field: \'count\', operator: \'between\', value: [\'\', \'30\']}}', () => {
            const pql = PQL.fromPQLFilters([{field: 'count', operator: 'between', value: ['', '30']}]);
            expect(pql).toEqual('count between (null, 30)');
        });

        it('should convert {field: \'count\', operator: \'between\', value: [\'10\', \'\']}}', () => {
            const pql = PQL.fromPQLFilters([{field: 'count', operator: 'between', value: ['10', '']}]);
            expect(pql).toEqual('count between (10, null)');
        });

        it('should convert {field: \'privacy\', operator: \'between\', value: \'\'}', () => {
            const pql = PQL.fromPQLFilters([{field: 'privacy', operator: 'between', value: ''}]);
            expect(pql).toEqual('');
        });
    });
});
