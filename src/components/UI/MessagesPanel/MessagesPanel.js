import React from 'react'

import styles from './MessagesPanel.css'

const messagesPanel = props => {
  const messages = props.messages.length > 0 ?
  props.messages.map(message => {
    // TODO: Format time properly depending on how old it is
    const date = new Date(message.sent)
    const dateSent = date.toUTCString()
    return (
      <li key={message._id} className={styles.Message}>
        <span className={styles.MessageTimestamp}>[{dateSent}]</span>
        <span className={styles.MessageCharacterName}>{message.characterName}</span>
        {message.contents}
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

export default messagesPanel
