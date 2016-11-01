import React from 'react';

function AddedFilter(props) {
  return (
    <li>{props.indexValue}. {props.filter.field} : {props.filter.value}</li>
  );
}

function AddedFilters(props)
{
  return (
        <ul>
          {props.addedFilters.map((filter,index)=>
          <AddedFilter filter={filter} key={index} indexValue={index+1} />
          )}
        </ul>
    );
}

export default AddedFilters;
