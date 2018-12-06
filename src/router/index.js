import Vue from 'vue'
import Router from 'vue-router'
import Todo from '../view/Todo'
import SignUpAndLogIn from '../view/SignUpAndLogin'
import SignUp from '../view/SignUp'
import LogIn from '../view/LogIn'
import FindPassword from '../view/FindPassword'
import ValidateEmail from '../view/ValidateEmail'
import ErrorPage from '../view/ErrorPage'

Vue.use(Router)

const routes = [{
  path: '',
  component: Todo
}, {
  path: '/login',
  component: SignUpAndLogIn,
  children: [
    { path: '', name: 'login', component: LogIn, alias: 'login', props: true },
    { path: 'signup', name: 'signup', component: SignUp, props: true },
    { path: 'findpassword', name: 'find-password', component: FindPassword, props: true },
    { path: 'validate', component: ValidateEmail }
  ]
}, {
  path: '/main',
  component: Todo
}, {
  path: '/error',
  name: 'error',
  component: ErrorPage
}]
export default new Router({
  mode: 'history',
  base: '/todo/',
  routes
})
