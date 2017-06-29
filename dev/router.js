import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = resolve => require(['./component/Home.vue'], resolve);
const Controller = resolve => require(['./component/Controller.vue'], resolve);
const Message = resolve => require(['./component/Message.vue'], resolve);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/Controller',
        name: 'Controller',
        component: Controller,
    },
    {
        path: '/Message',
        name: 'Message',
        component: Message,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
