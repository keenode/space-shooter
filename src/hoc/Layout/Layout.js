import React from 'react'

import styles from './Layout.css'

const layout = props => (
  <main className={styles.LayoutContainer}>
    {props.children}
  </main>
)

export default layout
