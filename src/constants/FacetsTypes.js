let types = {
    TEXT: 'TEXT',
    NUMERIC_RANGE: 'NUMERIC_RANGE',
    HEAT_MAP: 'HEAT_MAP',
}

const FacetsGenerators = {
    text:(field, searchText, options ) => {
        return {type:types.TEXT, field, searchText, options};
    },
    numericRange:(field, fullRange, selectedRange, options) => {
        return {type:types.NUMERIC_RANGE, field:field, fullRange:fullRange, options:options};
    },
    heatMap:(field, area, options) =>{
        return {type:types.HEAT_MAP, field, area, options};
    }
}

types = {
    ...types,
    generators:FacetsGenerators
}

export default types;

