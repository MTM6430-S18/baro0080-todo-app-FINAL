<template>
<div v-if="isEditing"  @keyup.esc="cancel">
    <form class="edit-task-form" @submit.prevent="save">
    <label>
      Title
      <input v-model.trim="editTask.title" type="text" required>
    </label>
    <label>
      Description
      <textarea v-model.trim="editTask.description" name="description">
      </textarea>
    </label>
    <label>
      Category
      <select class="category" v-model.trim="editTask.category.name">
        <option value="" name="None">None</option>
        <option value="Homework" name="Homework">Homework</option>
        <option value="Chores" name="Chores">Chores</option>
        <option value="Groceries" name="Groceries">Groceries</option>
        <option value="Work" name="Work">Work</option>
      </select>
    </label>
    <div class="grid-form">
    <label>
      Due At
      <input class="dueDate" v-model="editTask.dueAt" type="date" required>
    </label>
    <label>
      Priority
      <select class="priority" v-model.trim="editTask.priority.name" required>
        <option value="!!!">High</option>
        <option value="!!">Medium</option>
        <option value="!">Low</option>
      </select>
    </label>
    </div>
        <button class="button" type="submit">Save</button>
        <button class="button isOutline" type="button" @click="cancel">Cancel</button>
    </form>
  </div>
<div v-else class="task-list-item">
        <font-awesome-icon class="font-awesome-icon" :icon="statusIcon" @click="$emit('toggleDone', task)" />
        <div class="list-items">
        <span>{{ task.priority.name }}</span>
        <span>{{ task.title }}</span>
        <span>{{ task.dueAt }}</span>
        <span class="edit-button" @click="edit">Edit</span>
        <span class="description">{{ task.description }}</span>
        <span>{{ task.category }}</span>
        </div>
        <font-awesome-icon class="font-awesome-icon" :icon="deleteIcon" @click="$emit('deleteTask', task)" />
    </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faCircle from '@fortawesome/fontawesome-free-regular/faCircle'
import faCheckCircle from '@fortawesome/fontawesome-free-regular/faCheckCircle'
import faTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt'

export default {
  components: { FontAwesomeIcon },
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
  props: ['task'],
  data: () => ({
    isEditing: false,
    editTask: {}
  }),
  computed: {
    statusIcon () {
      return this.task.isComplete ? faCheckCircle : faCircle
    },
    deleteIcon () {
      return faTrashAlt
    }
  },
  methods: {
    cancel () {
      this.isEditing = false
    },
    edit () {
      this.editTask = Object.assign({}, this.task)
      this.isEditing = true
    },
    save () {
      this.$emit('updateTask', this.editTask)
      this.isEditing = false
    }
  }
}
</script>

<style lang="scss">
.edit-task-form {
    margin: 15px;
    max-width: 100%;
    background-color: rgba(54, 73, 94, 0.3);
    padding: 5px;
    display: block;
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
        border: 1px solid black;
    }
    textarea{
        display: block;
        margin: 5px auto;
        width: 200px;
        border-radius: 5px;
        border: 1px solid black;
    }
    select{
        margin: 5px auto;
        height: 25px;
        background-color: white;
        border: 1px solid black;
    }
    .category{
        display: block;
            width: 200px;
        }
    .priority{
        display: block;
            width: 120px;
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
.task-list-item{
    display: grid;
    grid-template-columns: 20px 1fr 20px;
    align-items: center;
    margin: 10px 0;
    padding: 0.5rem;
    font-size: 13px;
    align-items: center;
    background-color: rgba(54, 73, 94, 0.15);
    border: 3px solid rgba(54, 73, 94, 0.6);
    border-radius: 5px;

    .font-awesome-icon{
        &:hover{
            cursor: pointer;
        }
    }
}
.list-items{
    display: grid;
    grid-template-columns: 0fr 1fr 1fr;
    span {
        padding: 3px;
    }
        .edit-button{
            font-size: 12px;
            text-decoration: underline;
            @media only screen and (min-width: 640px) {
                font-size: 13px;
            }
            &:hover{
                cursor: pointer;
            }
        }
}
@media only screen and (min-width: 640px) {
    .task-list-item{
        grid-template-columns: 50px 1fr 20px;
        font-size: 15px;

    }
}
.button {
    margin: 10px;
    height: 25px;
    border-radius: 5px;
    width: 80px;
    background-color: #36495E;
    color: white;
    font-weight: bold;
    &:hover{
        cursor: pointer;
    }
}
.description{
    font-size: 11px;
    @media only screen and (min-width: 640px){
        font-size: 12px;
    }
}
</style>
