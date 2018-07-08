import React, { Component } from 'react'

import styles from './MessagesPanel.css'

const messageColors = {
  'log': 'white',
  'shieldsDamaged': 'cyan',
  'hullDamaged': 'lightGreen',
  'noFuel': 'magenta',
  'playerShipDestroyed': 'red'
}

class MessagesPanel extends Component {
  previousMsgsLength = 0

  constructor(props) {
    super(props)
    this.messagesContainerRef = React.createRef()
  }

  componentDidMount() {
    this.setChatScrollToBottom()
  }

  componentDidUpdate() {
    this.setChatScrollToBottom()
  }

  setChatScrollToBottom() {
    if (this.props.messages.length !== this.previousMsgsLength) {
      this.messagesContainerRef.current.scrollTop = this.messagesContainerRef.current.scrollHeight
      this.previousMsgsLength = this.props.messages.length
    }
  }

  render() {
    const messages = this.props.messages.length > 0 ?
    this.props.messages.map((message, index) => {
      // TODO: Format time properly depending on how old it is
      const date = new Date(message.sent)
      const dateSent = date.toUTCString()
      return (
        <li key={index} className={styles.Message}>
          <span className={styles.MessageTimestamp}>[{dateSent}]</span>
          <span style={{ color: messageColors[message.type] }}>
            {message.contents}
          </span>
        </li>
      )
    }) :
    <li className={styles.Message}>No messages.</li>

    return (
      <div className={styles.MessagesPanel}>
        <ul className={styles.MessagesPanelTabs}>
          <li className={[styles.MessagesPanelTab, styles.MessagesPanelTabActive].join(' ')}>Messages</li>
        </ul>
        <ul ref={this.messagesContainerRef} className={styles.MessagesContainer}>
          {messages}
        </ul>
      </div>
    )
  }
}

export default MessagesPanel
