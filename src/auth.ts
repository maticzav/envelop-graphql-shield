import passport from 'passport'
import { BasicStrategy } from 'passport-http'

/**
 * This file contains authentication mechanisms we use in our schema.
 */

type User = {
  id: string
  username: string
  password: string
}

const users: User[] = [
  {
    id: 'mmm',
    username: 'maticzav',
    password: 'verysecret',
  },
]

// Passport

/**
 * BasicStrategy that we use for authenticating.
 */
export const strategy = new BasicStrategy(function (username, password, done) {
  const user = users.find((user) => user.username === username)

  if (user === undefined) {
    return done(null, false)
  }

  if (user.password !== password) {
    return done(null, false)
  }

  return done(null, user)
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  const user = users.find((user) => user.id === id)

  if (user === undefined) {
    return done(`No user ${id}`, false)
  }

  return done(null, user)
})
