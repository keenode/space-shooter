import React from 'react'
import { NavLink } from 'react-router-dom'

import NavItem from './NavItem/NavItem'

import styles from './NavBar.css'

const navBar = () => (
  <nav className={styles.NavBar}>
    <div className={styles.Container}>
      <NavLink to="/" exact>
        <h1 className={styles.Title}>Space Shooter</h1>
      </NavLink>
      <ul className={styles.NavBarItems}>
        <NavItem link="/" exact>Home</NavItem>
        <NavItem link="/play">Play</NavItem>
      </ul>
    </div>
  </nav>
)

export default navBar
