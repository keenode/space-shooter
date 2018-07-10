import React, { Component } from 'react'

import styles from './LogsPanel.css'

const logColors = {
  'log': 'white',
  'shieldsDamaged': 'cyan',
  'hullDamaged': 'lightGreen',
  'noFuel': 'magenta',
  'playerShipDestroyed': 'red'
}

class LogsPanel extends Component {
  previousMsgsLength = 0

  constructor(props) {
    super(props)
    this.logsContainerRef = React.createRef()
  }

  componentDidMount() {
    this.setChatScrollToBottom()
  }

  componentDidUpdate() {
    this.setChatScrollToBottom()
  }

  setChatScrollToBottom() {
    if (this.props.logs.length !== this.previousMsgsLength) {
      this.logsContainerRef.current.scrollTop = this.logsContainerRef.current.scrollHeight
      this.previousMsgsLength = this.props.logs.length
    }
  }

  render() {
    const logs = this.props.logs.length > 0 ?
    this.props.logs.map((log, index) => {
      const date = new Date(log.sent)
      const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      const dateSent = date.toLocaleDateString().split('/').join('.') + ' - ' + date.getHours() + ':' + date.getMinutes() + ':' + seconds
      return (
        <li key={index} className={styles.Log}>
          <span className={styles.LogTimestamp}>{dateSent}</span>
          <span style={{ color: logColors[log.type] }}>
            {log.contents}
          </span>
        </li>
      )
    }) :
    <li className={styles.Log}>No logs.</li>

    return (
      <div className={styles.LogsPanel}>
        <ul className={styles.LogsPanelTabs}>
          <li className={[styles.LogsPanelTab, styles.LogsPanelTabActive].join(' ')}>Logs</li>
        </ul>
        <ul ref={this.logsContainerRef} className={styles.LogsContainer}>
          {logs}
        </ul>
      </div>
    )
  }
}

export default LogsPanel
