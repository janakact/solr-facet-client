import React from 'react'
import { connect } from 'react-redux'
import { requestFields } from '../actions'

let ConnectionInfo = ({ dispatch }) => {
  let input = "http://localhost:8983/solr/gettingstarted/";

  return (
    <div>
      <form
          onSubmit={e => {
            e.preventDefault()
            if (!input.trim()) {
              return
            }
            dispatch(requestFields(input))
      }}>
        <input
            value = {input}
            ref={node => {
            input = node.value
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
