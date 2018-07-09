import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

import hullReducer from './store/reducers/hull'
import messagesReducer from './store/reducers/messages'

import './index.css'


const rootReducer = combineReducers({
  hull: hullReducer,
  messages: messagesReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))
registerServiceWorker()
