import React from 'react'

import styles from './Layout.css'

const layout = props => (
  <div className={styles.AppContainer}>
    <main className={styles.LayoutContainer}>
      {props.children}
    </main>
  </div>
)

export default layout
