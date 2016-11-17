import React from 'react'
import { connect } from 'react-redux'
import { setBaseUrl } from '../actions'

let ConnectionInfo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form
          onSubmit={e => {
            e.preventDefault()
            if (!input.value.trim()) {
              return
            }
            dispatch(setBaseUrl(input.value))
            input.value = '--'
      }}>
        <input ref={node => {
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
