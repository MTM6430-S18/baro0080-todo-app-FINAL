<template>
  <form class="form" @submit.prevent="login">
  <div class="header">
    <img src="@/assets/logo.png" alt="vue.js">
         <h1>Vue Todo</h1>
        <p>{{ (new Date()).toDateString() }}</p>
  </div>
    <div class="form-group">
      <label for="email">Login name</label>
      <div class="errors" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <input
        id="email"
        type="email"
        autocomplete="username"
        placeholder="email"
        required
        v-model="username"
      >
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="password"
        v-model="password"
        autocomplete="current-password"
        required
      >
    </div>
    <button type="submit">{{ isWorking ? 'Working ...' : 'LOGIN'}}</button>
  </form>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'LoginForm',
  data: () => ({
    username: '',
    password: '',
    errorMessage: '',
    isWorking: false
  }),
  methods: {
    login () {
      // validation
      this.errorMessage = ''
      this.isWorking = true
      axios.post(
        'https://vue-todos.robertmckenney.ca/oauth/token',
        {
          grant_type: 'password',
          client_id: 13,
          client_secret: 'PgyCnnnuMlyARWY8dRDRIHGXvuFnSch2m6lPm2Rc',
          username: this.username,
          password: this.password,
          scope: '*'
        }
      ).then(response => {
        const apiTokens = {
          expires_at: moment().add(response.data.expires_in, 'second').format(),
          ...response.data
        }
        this.$emit('userDidAuthenticate', apiTokens)
        this.username = ''
        this.password = ''
      }).catch(error => { this.handleError(error) })
        .finally(() => { this.isWorking = false })
      // redirect to the main application view
    },
    handleError (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400: {
            this.errorMessage = 'Both username and password are required.'
            break
          }
          case 401: {
            this.errorMessage = 'Incorrect username or password.'
            break
          }
          default: {
            this.errorMessage = 'Sorry. There was an problem on the server.'
          }
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error: ', error.message)
      }
      console.log(error.config)
    }
  }
}
</script>

<style>

/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.form {
  padding: 1.5em;
}
.form-group {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.25em;
  font-size: 0.875em;
  color: hsl(0, 0%, 22%);
}
.form-group input {
  border-radius: 0.25rem;
  border: 1px solid hsl(0, 0%, 88%);
  padding: 0.25em;
  font-size: 1.1em;
}
.form-group input::placeholder {
  opacity: 0.54;
}
.form button {
  background-color: #36495E;
  border: none;
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 4px 1px;
  color: white;
  font-size: 1.1em;
  font-weight: 500;
  padding: 0.5em 0.75em;
}
.errors {
  border-radius: 0.25em;
  border: 1px solid hsl(348, 83%, 93%);
  color: hsl(348, 83%, 47%);
  background-color: hsl(348, 63%, 97%);
  padding: 1.5em;
}
.header {
  background-color: rgba(54, 73, 94, 0.3);
}
</style>
