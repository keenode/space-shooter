import React from 'react'

import NavBar from '../../components/UI/NavBar/NavBar'

import styles from './Layout.css'

const layout = props => (
  <div className={styles.AppContainer}>
    <NavBar />
    <main className={styles.LayoutContainer}>
      {props.children}
    </main>
  </div>
)

export default layout
