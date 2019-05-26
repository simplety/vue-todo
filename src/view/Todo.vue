<template>
  <div id="todo">
    <div class="modal" :class="{active: editing.show}">
      <div class="todo-card">
        <div class="content-wrap">
          <textarea class="content" v-model="editing.content"/>
          <!-- @keyup="setValue(editing, 'content', $event.currentTarget.innerText)" /> -->
        </div>
        <div class="row">
          <div class="calendar-wrap">
            <div class="button" @click="togglePanelShow(editing, 'showCalendar')">
              <icon class="icon-calendar" name="calendar"/>
              <span>{{localExpOfDate(editing.deadline)}}</span>
            </div>
            <calendar :show.sync="editing.showCalendar" v-model="editing.deadline"/>
          </div>
          <div class="starbar-wrap">
            <div class="button" @click="togglePanelShow(editing, 'showStarBar')">
              <icon class="icon-star" name="star" :aria-label="'重要程度'"/>
              <star-bar :count="editing.degree" direction="left" max.number="5"/>
            </div>
            <icon-select
              :show.sync="editing.showStarBar"
              v-model="editing.degree"
              class="bottom-right"
            />
          </div>
        </div>
        <div class="button-wrap">
          <a href="javascript: void(0);" class="confirm" @click="editDoneTodo">确定</a>
          <a href="javascript: void(0);" class="cancel" @click="editing.show = false">取消</a>
        </div>
      </div>
    </div>
    <div class="userinfo">
      <icon name="user"/>
      <span>{{username||''}}</span>
      <icon name="logout" @click.native="logOut"/>
    </div>
    <div class="newTodo">
      <label>
        <input
          type="text"
          v-model="newTodo.content"
          placeholder="type in..."
          @keypress.enter="addTodo"
        >
        <icon name="enter" @click.native="addTodo"/>
        <div class="info">
          <span
            class="deadline"
            :class="{active:newTodo.deadline != null}"
          >{{localExpOfDate(newTodo.deadline)}}</span>
          <star-bar :count="newTodo.degree" direction="left" max.number="5"/>
        </div>
      </label>
      <div class="wrap">
        <icon
          class="icon-calendar"
          name="calendar"
          @click.native="togglePanelShow(newTodo, 'showCalendar')"
          title="最后期限"
        />
        <calendar :show.sync="newTodo.showCalendar" v-model="newTodo.deadline"/>
      </div>
      <div class="wrap">
        <icon
          class="icon-star"
          name="star"
          @click.native="togglePanelShow(newTodo, 'showStarBar')"
          title="'重要程度'"
        />
        <icon-select :show.sync="newTodo.showStarBar" v-model="newTodo.degree"/>
      </div>
    </div>
    <div class="wrap">
      <div class="sort-wrap">
        <icon name="sort"/>
        <div class="sort-button">
         <a href="javascript:void(0);" v-for="(type, num) in sort.typeList" :key="num" 
         @click="switchSortType(num)" :class="{active: num===sort.type}">{{type}}</a>
          <!-- <a href="javascript:void(0);" @click="switchSortType(0)" :active="">sort.typeList</a>
          <a href="javascript:void(0);" @click="switchSortType(1)">deadline</a>
          <a href="javascript:void(0);" @click="switchSortType(2)">importance</a>
          <a href="javascript:void(0);" @click="switchSortType(3)">completeness</a> -->
        </div>
      </div>

      <ul class="todos">
        <li v-for="(todo,i) in sortedTodos" :key="i">
          <input type="checkbox" v-model="todo.done" @change="updateTodo(todo)">
          <p :title="todo.content">{{todo.content}}</p>
          <div class="info">
            <span>{{localExpOfDate(todo.deadline)}}</span>
            <star-bar :count="todo.degree" direction="left" max.number="5"/>
          </div>
          <icon class="icon-edit" name="edit" @click.native="editTodo(todo)"/>
          <icon class="icon-delete" name="delete" @click.native="removeTodo(todo)"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Date2 from '../class/Date2'
import * as todoUtil from '../util/todoUtil.js'
import Calendar from '../components/common/Calendar'
import IconSelect from '../components/IconSelect'
import Icon from '../components/common/Icon'
import StarBar from '../components/common/starBar'
import { logOut, getCurrentUser } from '../util/userUtil'

export default {
  name: 'Todo',
  components: {
    'calendar': Calendar,
    'icon': Icon,
    'icon-select': IconSelect,
    'star-bar': StarBar
  },
  data () {
    return {
      newTodo: {
        content: '',
        deadline: null,    // date
        degree: 1,
        showCalendar: false,
        showStarBar: false
      },
      editing: {
        content: '',
        degree: 1,
        deadline: null,
        show: false,
        showCalendar: false,
        showStarBar: false
      },
      sort: {
        typeList: ['createdAt', 'deadline', 'degree', 'done'],
        type: 0,
        order: 1
      },
      todoList: [],
      doneList: [],
      curUser: null
    }
  },
  computed: {
    username: function () {
      if (this.curUser && this.curUser.username) {
        return this.curUser.username
      } else return ''
    },
    sortedTodos: function () {
      console.log(this.todoList)
      let { typeList, type, order } = this.sort
      let sortedArr = this.todoList.concat()
      if (!type) return sortedArr
      if (sortedArr.length < 2) return sortedArr
      sortedArr.sort((a, b) => {
        return a[typeList[type]] - b[typeList[type]]
      })
      if (order === -1) {
        sortedArr.reverse()
      }
      return sortedArr
    }
  },
  methods: {
    // callback function to get ID.
    setValue: function (obj, attr, val) {
      obj[attr] = val
    },
    localExpOfDate: function (date) {
      if (date instanceof Date) {
        return new Date2(date).localExp
      } else if (date instanceof Date2) {
        return date.localExp
      } else return ''
    },
    updateLocal: function (todoObj, index) {
      let { content, deadline, degree, id } = todoObj
      let item = { content, deadline, degree, id }
      if (typeof index === 'number') {
        this.todoList.splice(index, 1, item)
      } else if (index === undefined) {
        this.newTodo.content = ''
        this.newTodo.deadline = null
        this.newTodo.degree = 1
        this.todoList.push(item)
      }
    },
    togglePanelShow: function (obj, attr) {
      let flag
      if (typeof obj[attr] === 'boolean') {
        flag = obj[attr]
      }
      this.hideAllPopUp()
      obj[attr] = !flag
    },
    hideAllPopUp: function () {
      this.newTodo.showCalendar = false
      this.newTodo.showStarBar = false
      this.editing.showCalendar = false
      this.editing.showStarBar = false
    },
    addTodo: function () {
      if (this.newTodo !== '') {
        let { content, deadline, degree } = this.newTodo
        let newTodoObj = Object.assign({ content, deadline, degree }, { done: false })
        todoUtil.createTodo(newTodoObj, this.curUser, this.updateLocal)
      } else {
        alert('不能为空')
      }
    },
    editTodo: function (todoObj) {
      let { content, deadline, degree, done, id } = todoObj
      Object.assign(this.editing, { content, deadline, degree, done, id }, { index: this.todoList.indexOf(todoObj) })
      this.togglePanelShow(this.editing, 'show')
    },
    editDoneTodo: function () {
      todoUtil.updateTodo(this.editing, function () {
        this.togglePanelShow(this.editing, 'show')
        this.updateLocal(this.editing, this.editing.index)
      }.bind(this))
    },
    updateTodo: function (todoObj) {
      todoUtil.updateTodo(todoObj)
    },
    removeTodo: function (todoObj) {
      todoUtil.removeTodo(todoObj, function () {
        let index = this.todoList.indexOf(todoObj)
        this.todoList.splice(index, 1)
      }.bind(this))
    },
    logOut: function () {
      var username = this.username
      logOut()
      this.curUser = null
      this.$router.replace({ name: 'login', params: { username } })
      window.sessionStorage.clear()
    },
    switchSortType: function (newType) {
      if (typeof (newType) === 'string') {
        newType = this.sort.typeList.indexOf(newType)
        if (newType !== -1) this.sort.type = newType
      } else if (typeof (newType) === 'number') {
        if ((newType >= 0) && (newType < this.sort.typeList.length)) {
          this.sort.type = newType
        }
      }
    },
    toggleSortOrder: function (order) {
      if (order === 1 || order === -1) {
        this.sort.order = order
      }
    }
    // sessionHdler: function () {
    //   let dataString = JSON.stringify({
    //     todoList: this.todoList,
    //     newTodo: this.newTodo
    //   })
    //   window.sessionStorage.setItem('todos', dataString)
    // }
  },
  created: function () {
    window.addEventListener('beforeunload', () => {
      let {content, deadline, degree} = this.newTodo
      window.sessionStorage.setItem('newTodo', JSON.stringify({content, deadline, degree}))
    })
    this.curUser = getCurrentUser()
    let newTodo = JSON.parse(window.sessionStorage.getItem('newTodo'))
    if (newTodo) {
      let {content, deadline, degree} = newTodo
      this.newTodo.content = content
      this.newTodo.deadline = deadline ? new Date(deadline) : null
      this.newTodo.degree = degree
    }
    this.todoList = todoUtil.getTodosByUserObj(this.curUser) || []
    // if (!this.curUser) {
    //   this.$router.replace('/login')
    // } else {
    //   if (newTodo) {
    //     this.newTodo = newTodo
    //     this.newTodo.deadline = newTodo.deadline ? new Date(newTodo.deadline) : null
    //   }
    //   this.todoList = todoUtil.getTodosByUserObj(this.curUser) || []
    // }
  },
  destroyed: function () {
    window.removeEventListener('beforeunload', () => {
      window.sessionStorage.setItem('newTodo', JSON.stringify(this.newTodo))
    })
  }
  // created: function () {
  //   window.addEventListener('beforeunload', this.sessionHdler.bind(this))
  //   let oldData = JSON.parse(window.sessionStorage.getItem('todos')) || {}
  //   this.curUser = getCurrentUser()
  //   if (!this.curUser) {
  //     this.$router.replace('/login')
  //   } else if (oldData.newTodo) {
  //     // read data from sessionStorage
  //     this.newTodo = oldData.newTodo
  //     // parse Date class attributes
  //     this.newTodo.deadline = oldData.newTodo.deadline ? new Date(oldData.newTodo.deadline) : null
  //     if (oldData.todoList.constructor === Array) {
  //       this.todoList = oldData.todoList.map((todo) => {
  //         todo.deadline = todo.deadline ? new Date(todo.deadline) : null
  //         return todo
  //       })
  //     }
  //   } else {
  //     this.todoList = todoUtil.getTodosByUserObj(this.curUser) || []
  //   }
  // },
  // destroyed: function () {
  //   window.removeEventListener('beforeunload', this.sessionHdler.bind(this))
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
#todo {
  max-width: 960px;
  min-width: 600px;
  height: 100%;
  margin: 0 auto;
  padding: 1rem 3.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  background: #f1f1f1;
  color: #3b4e32;
  display: flex;
  flex-direction: column;
  > .modal {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 2;
    display: none;
    &.active {
      display: block;
    }
    > .todo-card {
      width: 30rem;
      border-radius: 0.2rem;
      background: #f1f1f1;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-top: 0.5rem solid #379392;
      border-bottom: 0.2rem solid #379392;
      padding: 1rem;
      > .content-wrap {
        width: 100%;
        height: 10rem;
        overflow: hidden;
        display: flex;
        > .content {
          font-size: 1.2rem;
          line-height: 1.5rem;
          height: 100%;
          background: #fff;
          text-align: left;
          flex-grow: 1;
          margin-right: -0.9375rem;
          padding: 0.5rem;
          overflow-y: scroll;
          border: none;
          outline: none;
          font-weight: light;
          color: #555;
        }
      }
      > .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        position: relative;
        .button {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          opacity: 0.8;
          cursor: pointer;
          transition: all 0.1s ease-out;
          &:hover {
            opacity: 1;
          }
        }
        > .calendar-wrap {
          > .button {
            > .icon-calendar {
              width: 1.5rem;
              height: 1.5rem;
              margin-right: 0.5rem;
              fill: #379392;
            }
            > span {
              min-width: 5rem;
              color: #444;
            }
          }
          > .calendar {
            position: absolute;
            left: 0;
            bottom: 100%;
            z-index: 100;
            width: 17rem;
          }
        }
        > .starbar-wrap {
          // position: relative;
          // display: flex;
          // align-items: center;
          // cursor: pointer;
          // opacity: 0.8;
          // transition: all 0.1s ease-out;
          // &:hover {
          //   opacity: 1;
          // }
          > .button {
            > .star-bar {
              width: 5rem;
              fill: #555;
            }
            > .icon-star {
              width: 1.5rem;
              height: 1.5rem;
              fill: #379392;
              margin-right: 0.5rem;
            }
          }
          > .icon-select {
            width: 10rem;
            position: absolute;
            right: 0;
            bottom: 100%;
            z-index: 100;
          }
        }
        > a {
          width: 5rem;
          line-height: 1.5;
          background: red;
          border-radius: 0.2rem;
        }
      }
      > .button-wrap {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
        > a {
          width: 5rem;
          line-height: 1.8;
          border-radius: 0.2rem;
          transition: all 0.1s ease-out;
          opacity: 0.8;
          &:hover {
            opacity: 1;
          }
          &.confirm {
            background: #e71d36;
            color: #f1f1f1;
          }
          &.cancel {
            background: #9dc8c8;
            color: #333;
          }
        }
      }
    }
  }
  > .userinfo {
    font-size: 1.2rem;
    height: 3.125rem;
    color: #3b4e32;
    font-weight: 100;
    display: flex;
    align-items: flex-end;
    border-bottom: 0.125rem solid #9baec8;
    > .icon-user {
      // display: inline-block;
      // width: 2.8125rem;
      // height: 2.8125rem;
      // fill: #6d819c;
      // vertical-align: -0.15em;
      // overflow: hidden;
      width: 2rem;
      height: 2rem;
      margin: 0 0.5rem;
    }
    > span {
      flex-grow: 1;
      text-align: left;
    }
    > .icon-logout {
      width: 1.75rem;
      height: 1.75rem;
      // margin-right: .5rem;
      fill: #999;
      overflow: hidden;
      &:hover {
        fill: #379392;
        cursor: pointer;
      }
    }
  }
  > .newTodo {
    display: flex;
    align-items: center;
    position: relative;
    > label {
      flex-grow: 1;
      background: #f5f5f5;
      box-shadow: inset 0.125rem 0.125rem 0 #ccc;
      border: 0.0625rem solid #a1a1a1;
      border-radius: 0.5rem;
      padding: 0.1rem 1rem 0.6rem 1rem;
      display: flex;
      align-items: center;
      > input {
        flex-grow: 1;
        height: 3.5rem;
        font-size: 1.5rem;
        border: none;
        padding: 0;
        background: #f5f5f5;
      }
      > .icon-enter {
        width: 1.2rem;
        fill: #999;
        &:hover {
          fill: #379392;
        }
      }
      > .info {
        position: absolute;
        left: 1rem;
        bottom: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        > .deadline {
          font-size: 0.875rem;
          font-style: italic;
          &.active {
            margin-right: 2rem;
          }
        }
        > .star-bar {
          width: 5rem;
          height: 1rem;
          text-align: left;
          font-size: 0;
          padding-bottom: 0.125rem;
          fill: gold;
        }
      }
    }
    > .wrap {
      position: relative;
      &:hover {
        > .icon {
          fill-opacity: 0.9;
          background: #f1f1f1;
          // box-shadow: 0.0625rem 0.0625rem .0625rem #bbb inset, -0.0625rem -0.0625rem .0625rem #bbb;
          fill: #3b8686;
          cursor: pointer;
        }
      }
      > .icon {
        width: 3.125rem;
        height: 3.125rem;
        fill: #52616a;
        padding: 0.5rem;
        border-radius: 0.1rem;
        // box-shadow: 0 0 0 #bbb inset;
        transition: all 0.2s ease-in;
        margin-right: .5rem;
      }
      > .calendar {
        position: absolute;
        width: 20rem;
        right: 0;
        z-index: 1;
      }
      > .icon-select {
        position: absolute;
        right: 0;
        z-index: 1;
        &:before {
          content: "";
          display: block;
          height: 0;
          width: 0;
          border: 0.5rem solid transparent;
          border-bottom: 0.5rem solid #379392;
          position: absolute;
          top: -1rem;
          right: 1rem;
        }
        &:after {
          content: "";
          display: block;
          height: 0;
          width: 0;
          border: 0.5rem solid transparent;
          border-bottom: 0.5rem solid #f1f1f1;
          position: absolute;
          top: -0.92rem;
          right: 1rem;
        }
      }
    }
  }
  > .wrap {
    overflow: hidden;
    margin-top: 1rem;
    width: 100%;
    height: 80%;
    > .sort-wrap{
      display: flex;
      margin: 0 .5rem .25rem .5rem;
      >.icon-sort {
        margin-right: 1rem;
        fill: grey;
      }
      >.sort-button{
        display: flex;
        height: 1.25rem;
        flex-grow: 1;
        justify-content: space-around;
        >a {
          font-size: 14px;
          line-height: 1.25rem;
          flex-grow: 1;
          color: #333;
          background: rgba(200,200,200,0.3);
          border-right: .0625rem #fff solid;
          &:first-child {
            border-radius: .5rem 0 0 .5rem;
          }
          &:last-child {
            border-radius: 0 .5rem .5rem 0;
          }
          &:hover {
            background: rgba(200,200,200,.6);
          }
          &.active {
            background: rgba(200,200,200,.9);
          }
        }
      }
    }
    > .todos {
      overflow-x: hidden;
      overflow-y: scroll;
      height: 100%;
      min-width: 100%;
      margin-right: -15px;
      > li {
        border-bottom: 1px solid #ddd;
        font-size: 1.25rem;
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        margin-right: 15px;
        &:hover {
          background: #eee;
          transition: 0.3s all ease;
          box-shadow: inset 0 -0.125rem 0 0 #a5d296;
          border-bottom-color: #a5d296;
        }
        > input {
          border: 1px solid #f0e5de;
          margin-left: 0.625rem;
        }
        > input:checked ~ p {
          color: #dadbdb;
          text-decoration: line-through;
          transition: 0.5s all ease;
        }
        > p {
          height: 3rem;
          line-height: 3rem;
          margin-left: 0.625rem;
          flex-grow: 1;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            cursor: default;
          }
        }
        > .info {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          width: 4rem;
          align-items: flex-start;
          color: #77af9c;
          margin: 0 0.5rem;
          > .star-bar {
            width: 100%;
            height: 1rem;
            fill: #77af9c;
          }
        }
        > .icon {
          width: 1.2rem;
          height: 1.2rem;
          margin: 0 0.1rem;
          min-width: 1.2rem;
          fill: #aaa;
          &:hover {
            fill: #ee2560;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
