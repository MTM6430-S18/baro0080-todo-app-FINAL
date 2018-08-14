<template>
  <form class="new-task-form" @submit.prevent="addTask(newTask)">
    <label>
      Title
      <input v-model.trim="newTask.title" type="text" required>
    </label>
    <label>
      Description
      <textarea v-model.trim="newTask.description" name="description">
      </textarea>
    </label>
    <label>
      Category
      <select class="category" v-model.trim="newTask.category">
        <option value="null" name="None">None</option>
        <option value="1" name="Home">Home</option>
        <option value="2" name="School">School</option>
        <option value="3" name="Work">Work</option>
      </select>
    </label>
    <div class="grid-form">
    <label>
      Due At
      <input class="dueDate" v-model="newTask.dueAt" type="date" required>
    </label>
    <label>
      Priority
      <select class="priority" v-model.trim="newTask.priority" required>
        <option value="3" name="High">High</option>
        <option value="2" name="Medium">Medium</option>
        <option value="1" name="Low">Low</option>
      </select>
    </label>
    </div>
    <button class="button" type="submit">Add Task</button>
    <button class="button" @click="$router.go(-1)" type="button">Cancel</button>
  </form>
</template>

<script>
export default {
  data: () => ({
    newTask: {}
  }),

  created () {
    this.resetNewTask()
  },

  methods: {
    addTask () {
      this.$emit('addTask', this.newTask)
      this.resetNewTask()
      this.$router.go(-1)
    },

    resetNewTask () {
      this.newTask = {
        id: Date.now(),
        title: '',
        dueAt: (new Date()).toISOString().split('T')[0],
        isComplete: false,
        priority: '2',
        category: ''
      }
    }
  }
}
</script>

<style lang="scss">
.new-task-form {
    margin: 15px;
    max-width: 100%;
    background-color: rgba(54, 73, 94, 0.3);
    padding: 5px;
    label{
        display: block;
        margin: 10px;
    }
    input {
        display: block;
        margin: 10px auto;
        width: 200px;
        height: 23px;
        border-radius: 5px;
    }
    textarea{
        display: block;
        margin: 5px auto;
        width: 200px;
        border-radius: 5px;
    }
    select{
        margin: 5px auto;
        height: 25px;
        background-color: white;
display: block;
    }
    .category{
        display: block;
            width: 200px;
        }
    .priority{
            width: 110px;
            margin-top: 10px;
        }
    .dueDate{
        width: 120px;
    }
    .grid-form{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
.button {
    margin: 10px;
    height: 25px;
    border-radius: 5px;
    width: 80px;
    background-color: #36495E;
    color: white;
}
</style>
