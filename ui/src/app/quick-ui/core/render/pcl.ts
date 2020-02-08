/*
*  Peppa Condition Language (PCL) is a DSL for condition programming
*  field - operator - value
*  $context($filter) IS EMPTY // Array
*  $context($total) < 1
*  $context($total) eq 1
* */

import { Sentence } from './sentence';

const PCLOperators = ['is', '>', '<', '>=', '<=', 'eq', '='];
const PCLKeywords = ['AND'];

class PCLParserTreeNode {
    private compareResult: boolean;
    constructor(public field: any, public operator: string, public rawValue: string) {
    }

    compare() {
        switch (this.operator.toUpperCase()) {
            case 'IS': {
                this.compareResult = this.compareIS();
                break;
            }
            case '=':
            case 'EQ': {
                this.compareResult = this.compareEqAsString();
                break;
            }
            case '>':
            case '<':
            case '>=':
            case '<=': {
                this.compareResult = this.compareForNumber();
                break;
            }
        }
        return this.compareResult;
    }

    private compareIS() {
        const formatted = this.rawValue ? this.rawValue.toUpperCase() : '';
        switch (formatted) {
            case 'EMPTY': {
                return this.isNullOrEmpty(this.field);
            }
            case 'NULL': {
                return this.isNullOrEmpty(this.field);
            }
            case 'NOT EMPTY': {
                return !this.isNullOrEmpty(this.field);
            }
            case 'NOT NULL': {
                return !this.isNullOrEmpty(this.field);
            }
            default: {
                const raw = this.trimQuotes(this.rawValue);
                return this.field.toString() === raw;
            }
        }
    }

    private compareForNumber() {
        switch (this.operator) {
            case '>': return Number(this.field) > Number(this.rawValue);
            case '<': return Number(this.field) < Number(this.rawValue);
            case '>=': return Number(this.field) >= Number(this.rawValue);
            case '<=': return Number(this.field) <= Number(this.rawValue);
        }
    }
    private compareEqAsString() {
        if (this.isRawStringExpress) {
            const raw = this.trimQuotes(this.rawValue);
            return this.field.toString() === raw;
        } else {
            return this.field.toString() === this.rawValue.toString();
        }
    }

    private isNullOrEmpty(val: string | any[]) {
        return val && (val instanceof Array) ? !val.length : !val;
    }

    private get isRawStringExpress() {
        return new RegExp(/^"(.*?)"$/).test(this.rawValue);
    }

    private trimQuotes(val: string) {
        return val ? val.replace(/^"/, '').replace(/"$/, '') : val;
    }

}

export class PCL {
    private readonly innerParserTree: PCLParserTreeNode[] = [];

    public get parserTree() {
        return this.innerParserTree;
    }

    public get result() {
        return this.parserTree.length && this.parserTree.every(x => x.compare());
    }


    private get keywordSplitRegexp() {
        return new RegExp(`\\s+${PCLKeywords.join('|')}\\s+`);
    }

    private get queryRegexp() {
        return new RegExp(`^(.+)\\s+(${PCLOperators.join('|')})\\s+(.+)$`, 'ig');
    }

    constructor(private input: string, private translator: (field: string) => Sentence) {
        if (!this.input || typeof input !== 'string') {
            return;
        }
        this.innerParserTree = [];
        const PCLs = input.split(this.keywordSplitRegexp);
        if (PCLs && PCLs.length) {
            PCLs.map(x => this.parser(x.trim()));
        }
    }

    private parser(query: string) {
        const matches = this.queryRegexp.exec(query);
        if (matches) {
            const fieldSentence = this.translator(matches[1]);
            if (fieldSentence.valid) {
                const node = new PCLParserTreeNode(fieldSentence.value, matches[2], matches[3]);
                this.innerParserTree.push(node);
            }
        }
    }
}
