import React from 'react'
import { connect } from 'react-redux'
import { requestFields } from '../actions'

let ConnectionInfo = ({ dispatch }) => {
  let input;//
  //input.value = "http://localhost:8983/solr/gettingstarted/";

  return (
    <div>
      <form
          onSubmit={e => {
            e.preventDefault()
            if (!input.value.trim()) {
              return
            }
            dispatch(requestFields(input.value))
      }}>
        <input
            defaultValue="http://localhost:8983/solr/gettingstarted/"
            ref={node => {
            input = node
        }} />
        <button type="submit">
          Connect
        </button>
      </form>
    </div>
  )
}
ConnectionInfo = connect()(ConnectionInfo)

export default ConnectionInfo
