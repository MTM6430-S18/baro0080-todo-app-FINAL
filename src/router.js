import Vue from 'vue'
import Router from 'vue-router'
import TaskList from '@/components/TaskList.vue'
import Add from './components/NewTaskForm.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/active',
    name: 'active',
    components: {
      overdue: TaskList,
      upcoming: TaskList
    }
  },
  {
    path: '/completed',
    name: 'completed',
    components: {
      completed: TaskList
    }
  },
  {
    path: '/add',
    name: 'add',
    component: Add
  },
  {
    path: '*',
    redirect: '/active'
  }
  ]
})
