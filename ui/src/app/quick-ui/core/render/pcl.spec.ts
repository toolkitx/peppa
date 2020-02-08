import { PCL } from './pcl';
import { Sentence } from './sentence';

describe('PCL', () => {
    const translator = (value: any, valid: boolean = true) => {
        return <Sentence>{valid, value};
    };

    const getResult = (pcl: string, translateResultValue: any, translateResultValid: boolean = true): boolean => {
        const rs = new PCL(pcl, (val: string) => {
            return translator(translateResultValue, translateResultValid);
        });
        return rs.result;
    };

    it('should $context(test) = 1 be true if result is 1', () => {
        const rs = getResult('$context(filter) = 1', 1);
        expect(rs).toBeTruthy();
    });

    it('should $context(test) = 1 be false if result is 2', () => {
        const rs = getResult('$context(filter) = 1', 2);
        expect(rs).toBeFalsy();
    });

    it('should $context(test) = "1" be true if result is "1"', () => {
        const rs = getResult('$context(test) = "1"', 1);
        expect(rs).toBeTruthy();
    });

    it('should $context(test) eq "a" be true if result is "a"', () => {
        const rs = getResult('$context(test) eq "a"', 'a');
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS "a" be true if result is "a"', () => {
        const rs = getResult('$context(filter) eq "a"', 'a');
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS EMPTY be true if result is ""', () => {
        const rs = getResult('$context(test) IS EMPTY', '');
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS NOT EMPTY be true if result is "NOTEMPTY"', () => {
        const rs = getResult('$context(test) IS NOT EMPTY', 'NOTEMPTY');
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS NULL be true if result is ""', () => {
        const rs = getResult('$context(test) IS NULL', '');
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS NOT NULL be true if result is "NOTNULL"', () => {
        const rs = getResult('$context(test) IS NOT NULL', 'NOTNULL');
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS NULL be true if result is []', () => {
        const rs = getResult('$context(test) IS NULL', []);
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS NOT NULL be true if result is ["a"]', () => {
        const rs = getResult('$context(test) IS NOT NULL', ['a']);
        expect(rs).toBeTruthy();
    });

    it('should $context(test) IS "a" AND $ $context(test2) IS NOT EMPTY true', () => {
        const rs = getResult('$context(test) IS "a" AND $ $context(test2) IS NOT EMPTY', 'a');
        expect(rs).toBeTruthy();
    });
});
