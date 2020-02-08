/*
*  Peppa Query Language (PQL) is a DSL for table query
* */

const PQLOperators = ['=', '!=', '~', 'in', 'between'];
const PQLKeywords = ['AND'];
const PQLValueValidators = {
    '=': /^"(.*?)"$/,
    '!=': /^"(.*?)"$/,
    '~': /^"(.*?)"$/,
    'in': /^\("(.*?)"(\s?,\s?"(.*?)")?\)$/,
    'between': /^\(([^",]+)\s?,\s?([^",]+)\)$/
};

const PQLValueParsers = {
    'in': /"(.*?)"(\s+,\s+)?/ig,
};

export interface PQLFilter {
    field: string;
    operator: string;
    value: any;
}

class PQLParserTreeNode {
    valid = false;
    parsedValue: string | string[] | any[];

    constructor(public field: string, public operator: string, public rawValue: string) {
        const reg = this.validatorRegexp;
        this.valid = reg && reg.test(rawValue);
    }

    private get validatorRegexp() {
        return new RegExp(PQLValueValidators[this.operator], 'g');
    }

    private get parseValueRegexp() {
        return PQLValueParsers[this.operator] ? new RegExp(PQLValueParsers[this.operator], 'g') : this.validatorRegexp;
    }

    get value() {
        if (!this.valid) {
            return null;
        }

        if (this.parsedValue) {
            return this.parsedValue;
        }
        switch (this.operator) {
            case 'between': {
                const matches1 = this.parseValueRegexp.exec(this.rawValue);
                const from = this.convertBetweenValue(matches1[1]);
                const to = this.convertBetweenValue(matches1[2]);
                this.parsedValue = [from, to];
                break;
            }
            case 'in': {
                const rs: string[] = [];
                let match: any[];
                const reg = this.parseValueRegexp;
                while ((match = reg.exec(this.rawValue)) !== null) {
                    rs.push(match[1]);
                }
                this.parsedValue = rs;
                break;
            }
            case '=': {
                const matches2 = this.parseValueRegexp.exec(this.rawValue);
                this.parsedValue = matches2[1];
                break;
            }
            case '!=': {
                const matches2 = this.parseValueRegexp.exec(this.rawValue);
                this.parsedValue = matches2[1];
                break;
            }
            case '~': {
                const matches3 = this.parseValueRegexp.exec(this.rawValue);
                this.parsedValue = matches3[1];
                break;
            }
        }
        return this.parsedValue;
    }

    private convertBetweenValue(val: string) {
        // TODO detect value with date unit like: 1d, 2w, 2s, 3h
        return val === 'null' ? '' : val;
    }
}

export class PQL {
    private readonly innerParserTree: PQLParserTreeNode[] = [];

    static fromPQLFilters(filter: PQLFilter[]): string {
        const rs: string[] = [];
        filter.map((f: PQLFilter) => {
            switch (f.operator) {
                case 'between': {
                    if (f.value && f.value instanceof Array) {
                        const fVal = (f.value as string[]).map(x => x === '' ? 'null' : x);
                        const betweenVal = `(${fVal.join(', ')})`;
                        rs.push([f.field, f.operator, betweenVal].join(' '));
                    }
                    break;
                }
                case 'in': {
                    if (f.value && f.value instanceof Array) {
                        const fVal = (f.value as string[]).map(x => `"${x}"`);
                        const betweenVal = `(${fVal.join(', ')})`;
                        rs.push([f.field, f.operator, betweenVal].join(' '));
                    }
                    break;
                }
                default: {
                    rs.push([f.field, f.operator, `"${f.value.toString()}"`].join(' '));
                    break;
                }
            }
        });
        return rs.join(` ${PQLKeywords[0]} `);
    }

    static fromStringArray(input: string[]): PQL {
        const pql = PQL.concat(input);
        return new PQL(pql);
    }

    static concat(input: string[]): string {
        return input.join(` ${PQLKeywords[0]} `);
    }

    public get parserTree() {
        return this.innerParserTree;
    }

    // public toOData(): string {
    //     const rs: string[] = [];
    //     this.parserTree.map(x => rs.push(x.toOData()));
    //     return rs.join(' and ');
    // }

    public toFilterObject(): PQLFilter[] {
        return this.parserTree.map((x) => {
            return {field: x.field, operator: x.operator, value: x.value};
        });
    }

    public toFilterObjectString(): string {
        return JSON.stringify(this.toFilterObject());
    }

    public get valid() {
        return this.parserTree.length && this.parserTree.every(x => x.valid);
    }


    private get keywordSplitRegexp() {
        return new RegExp(`\\s+${PQLKeywords.join('|')}\\s+`);
    }

    private get queryRegexp() {
        return new RegExp(`^(\\w+)\\s+(${PQLOperators.join('|')})\\s+("(.*?)"|\\(.*?\\))$`);
    }

    constructor(private input: string) {
        if (!this.input || typeof input !== 'string') {
            return;
        }
        this.innerParserTree = [];
        const pqls = input.split(this.keywordSplitRegexp);
        if (pqls && pqls.length) {
            pqls.map(x => this.parser(x.trim()));
        }
    }

    private parser(query: string) {
        const matches = this.queryRegexp.exec(query);
        if (matches) {
            const node = new PQLParserTreeNode(matches[1], matches[2], matches[3]);
            this.innerParserTree.push(node);
        }
    }
}
