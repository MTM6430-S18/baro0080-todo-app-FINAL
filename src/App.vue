<template>
<div id="app">
  <div v-if="isLoggedIn">
<!--                HEADER      -->
    <header>
        <img src="@/assets/logo.png" alt="vue.js">
         <h1>Vue Todo</h1>
        <p>{{ (new Date()).toDateString() }}</p>
    </header>
    <div style="display: flex; justify-content: flex-end;">
      <button type="button" class="logout" @click="logoutUser" >LOGOUT</button>
    </div>
<!--                ADD TASK BUTTON      -->
    <div>
      <router-link class="add-task" to="/add">Add Task</router-link>
    </div>
    <router-view @addTask="addTask" @updateTask="updateTask"/>
<!--                ACTIVE/COMPLETE TABS      -->
    <div id="nav" class="tabs">
      <router-link to="/active">Active Tasks</router-link>
      <span></span>
      <router-link to="/completed">Completed Tasks</router-link>
    </div>
<div class="list-area">
<!--                SORT AND FILTER BUTTONS      -->
    <div id="filtering" class="tabs">
      <button @click="sortAscending = !sortAscending"><font-awesome-icon :icon="sortIcon" /> Due Date</button>
      <select name="priority-filter" id="priority-filter" v-model="selectedPriority">
      <option value="">Priority</option>
        <option v-for="option in priorityOptions" :value="option.id" :key="option.id">{{ option.name}}</option>
      </select>
      <select name="category-filter" id="category-filter" v-model="selectedCategory">
      <option value="">Category</option>
        <option v-for="option in categoryOptions" :value="option.id" :key="option.id">{{ option.name}}</option>
      </select>
    </div>
<!--                TRANSITION GROUPS      -->
    <transition-group name="tab">
      <router-view
        :tasks="overdueTasks"
        :class="{ 'overdue': !!overdueTasks.length }"
        name="overdue"
        key="overdue"
        :selectedPriority="selectedPriority"
        :selectedCategory="selectedCategory"
        :sortAscending="sortAscending"
        @updateTask="updateTask"
        @toggleDone="toggleDone"
        @deleteTask="deleteTask"
      />
      <router-view
        :tasks="upcomingTasks"
        class="incomplete"
        name="upcoming"
        key="upcoming"
        :selectedPriority="selectedPriority"
        :selectedCategory="selectedCategory"
        :sortAscending="sortAscending"
        @updateTask="updateTask"
        @toggleDone="toggleDone"
        @deleteTask="deleteTask"
      />
      <router-view
        :tasks="completedTasks"
        :class="{ 'completed': !!completedTasks.length }"
        name="completed"
        key="completed"
        :selectedPriority="selectedPriority"
        :selectedCategory="selectedCategory"
        :sortAscending="sortAscending"
        @updateTask="updateTask"
        @toggleDone="toggleDone"
        @deleteTask="deleteTask"
      />
    </transition-group>
    </div>
  </div>
  <login-form v-else @userDidAuthenticate="loginUser" />
  </div>
</template>

<!--                JAVASCRIPT      -->
<script>
import NewTaskForm from '@/components/NewTaskForm'
import TaskList from '@/components/TaskList'
import TaskListItem from '@/components/TaskListItem'
import LoginForm from '@/components/LoginForm'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import FaSort from '@fortawesome/fontawesome-free-solid/faSort'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'app',
  components: { NewTaskForm, TaskList, TaskListItem, FontAwesomeIcon, LoginForm },
  data: () => ({
    newTask: {},
    tasks: [],
    taskList: {},
    priorityOptions: [
      {id: '!!!', name: 'High'},
      {id: '!!', name: 'Medium'},
      {id: '!', name: 'Low'}
    ],
    selectedPriority: '',
    categoryOptions: [
      {id: 'Homework', name: 'Homework'},
      {id: 'Chores', name: 'Chores'},
      {id: 'Groceries', name: 'Groceries'},
      {id: 'Work', name: 'Work'}
    ],
    selectedCategory: '',
    sortAscending: true,
    api: {
      accessToken: '',
      expiresAt: ''
    }
  }),
  computed: {
    activeTasks () {
      return this.tasks.filter(task => !task.isComplete)
    },
    completedTasks () {
      return this.tasks.filter(task => task.isComplete)
    },
    overdueTasks () {
      return this.activeTasks.filter(
        task => new Date(task.dueAt) < Date.now() && !task.isComplete
      )
    },
    upcomingTasks () {
      return this.activeTasks.filter(task => new Date(task.dueAt) >= Date.now())
    },
    sortIcon () {
      return FaSort
    },
    isLoggedIn () {
      return this.api.accessToken && moment(this.api.expiresAt).isAfter()
    },
    axiosOptions () {
      return {
        baseURL: 'https://vue-todos.robertmckenney.ca/api',
        headers: { 'Authorization': `Bearer ${this.api.accessToken}` }
      }
    }
  },
  created () {
    this.resetForm()
    this.loadCachedData()
  },
  methods: {
    addTask (task) {
      axios.post('/tasks', task, this.axiosOptions)
        .then(({data: {data: t}}) => {
          this.tasks.push(task)
        })
        .catch(error => this.handleAPIErrors(error))
    },
    deleteTask (task) {
      axios.delete(`/todos/${task.id}`, this.axiosOptions)
        .then(response => {
          const index = this.tasks.findIndex(t => t.id === task.id)
          this.tasks.splice(index, 1)
        })
        .catch(error => this.handleAPIErrors(error))
    },
    toggleDone (task) {
      task.isComplete = !task.isComplete
    },
    updateTask (task) {
      axios.put(`/todos/${task.id}`, this.axiosOptions)
        .then(response => {
          // eslint-disable-next-line
      let target = this.tasks.find(t => t.id === task.id)
          target = Object.assign(target, task)
        })
        .catch(error => this.handleAPIErrors(error))
    },
    resetForm () {
      this.newTask = {
        title: '',
        description: '',
        dueAt: moment().format(),
        priority: 2,
        category: null,
        isComplete: false
      }
    },
    loadCachedData () {
      let apiTokens = localStorage.getItem('todoApiTokens')
      if (apiTokens === undefined) return
      apiTokens = JSON.parse(apiTokens)
      this.loginUser(apiTokens)
    },
    loginUser (apiTokens) {
      this.api.accessToken = apiTokens.access_token
      this.api.expiresAt = apiTokens.expires_at
      this.saveApiTokens(apiTokens)
      this.refreshTasks()
    },

    logoutUser () {
      this.api.accessToken = ''
      this.api.expiresAt = ''
      localStorage.removeItem('todoApiTokens')
    },

    saveApiTokens (apiTokens) {
      localStorage.setItem('todoApiTokens', JSON.stringify(apiTokens))
    },

    refreshTasks () {
      axios.get('/tasks', this.axiosOptions)
        .then(({data: {data}}) => {
          // this.taskList = Object.assign({}, ...data.map(t => ({ [t.id]: t })))
          this.tasks = data
        })
        .catch(error => this.handleAPIErrors(error))
    },
    handleAPIErrors (error) {
      // We will make this more robust net week
      console.log(error.message)
    }
  }
}
</script>
<!--                CSS      -->
<style lang="scss">

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
@import url('https://fonts.googleapis.com/css?family=Lato');
body{
  background-color: #F7FDFF;
}
header {
  background-color: rgba(54, 73, 94, 0.3);
}
#app {
  font-family: 'Lato', 'Avenir', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #F7FDFF;
  padding: 2px;
@media only screen and (min-width: 640px) {
max-width: 640px;
margin: 0 auto;}
}
#nav {
  padding: 30px;
  display: grid;
  grid-template-columns: 2fr 5px 2fr;
  a {
    font-weight: bold;
    color: white;
    background-color: #42B783;
    padding: 3px;
    border-radius: 5px;
    &.router-link-exact-active {
      text-decoration: none;
      background-color: #F7FDFF;
      color: #42B783;
      border-bottom: 1px solid #42B783;
    }
  }
}
.incomplete{
  color: black;
}
img {
  margin-top: 8px;
  height: 3rem;
  @media only screen and (min-width: 640px) {
    height: 4rem;
    width: auto;
  }
}
h1{
  padding: 5px;
  margin: 1px;
  font-size: 20px;
  font-weight: bold;
  color: rgba(54, 73, 94, 1);
  @media only screen and (min-width: 640px) {
    font-size: 25px;
  }
}
p{
  font-size: 11px;
  padding: 1px;
  padding-bottom: 10px;
  margin: 5px;
  margin-bottom: 20px;
  color: rgba(54, 73, 94, 1);
  @media only screen and (min-width: 640px) {
    font-size: 15px;
  }
}
.add-task{
  margin: 0 auto;
  background-color: #2c3e50;
  font-weight: bold;
  color: white;
  padding: 5px 8px 5px 8px;
  border-radius: 5px;
  @media only screen and (min-width: 640px) {
  font-size: 15px;
  width: 200px;
  }
}
#filtering{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  button, select{
    height: 23px;
    border-radius: 5px;
    border: 1px solid rgba(54, 73, 94, 0.5);
    background-color: #F7FDFF;
    font-size: 13px;
  }
}
.tabs {
  font-size: 14px;
  @media only screen and (min-width: 640px) {
    font-size: 18px;
  }
}
.list-area{
  margin-top: none;
  padding: 5px;
  border-radius: 5px;
  @media only screen and (min-width: 640px){
    border: 1px solid #2c3e50;
  }
}
.overdue{
  color: red;
  font-weight: bold;
}
.logout{
  background-color: #2c3e50;
  font-weight: bold;
  color: white;
  padding: 5px 8px 5px 8px;
  border-radius: 5px;
  &:hover{
    cursor: pointer;
  }
}
</style>
