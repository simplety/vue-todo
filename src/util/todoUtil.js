import AV from 'leancloud-storage'

export function createTodo (todoObj, userObj, done, undone) {
  let todo = new AV.Object('Todo')
  if (!userObj || !userObj.id) {
    return
  }
  if (!todoObj || !todoObj.content) {
    return
  }
  let userAV = AV.Object.createWithoutData('User', userObj.id)
  todo.set('content', todoObj.content)
  todo.set('done', todoObj.done)
  todo.set('owner', userAV)
  todo.set('deadline', todoObj.deadline)
  todo.set('degree', todoObj.degree)
  todo.save().then((val) => {
    done(Object.assign(todoObj, {id: todo.id}))
  }).catch(err => {
    if (undone instanceof Function) {
      undone(err)
    } else {
      console.log(err)
    }
  })
}

export function updateTodo (todoObj, done, undone) {
  if (!todoObj || !todoObj.id) { return }
  let todo = AV.Object.createWithoutData('Todo', todoObj.id)
  todo.set('content', todoObj.content)
  todo.set('done', todoObj.done)
  todo.set('deadline', todoObj.deadline)
  todo.set('degree', todoObj.degree)
  todo.save().then((val) => {
    if (done instanceof Function) {
      done(val)
    }
  }).catch(err => {
    if (undone instanceof Function) {
      undone(err)
    }
  })
}

export function removeTodo (todoObj, done, undone) {
  if (!todoObj || !todoObj.id) { return }
  let todo = AV.Object.createWithoutData('Todo', todoObj.id)
  todo.destroy().then((val) => {
    if (done instanceof Function) {
      done(val)
    }
  }).catch(err => {
    if (undone instanceof Function) {
      undone(err)
    }
  })
}

export function getTodosByUserObj (userObj) {
  let todoList = []
  let query = new AV.Query('Todo')
  let User = AV.Object.createWithoutData('User', userObj.id)
  query.equalTo('owner', User)
  query.find().then((todos) => {
    // transfer todo<AV.Object> to todo <in todoList>
    for (let todo of todos) {
      let { id, createdAt, attributes: { content, done, deadline, degree } } = todo
      todoList.push({ id, createdAt, content, done, deadline, degree })
    }
  }).catch(err => {
    console.log(err)
  })
  console.log(todoList)
  return todoList
}
