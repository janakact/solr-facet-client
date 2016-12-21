/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
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
        return {type:types.NUMERIC_RANGE, field, fullRange, selectedRange, options};
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

