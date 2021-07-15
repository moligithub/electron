import Vue from "vue";
import VueRouter from "vue-router";
import File from "../views/File.vue";
import TransformationEdit from "../views/TransformationEdit.vue";
import AutoTransformation from "../views/AutoTransformation.vue";
import UserInfo from "../views/UserInfo.vue";
import UserBaseInfo from "../views/UserInfo/UserBaseInfo.vue";
import ChangePwd from "../views/UserInfo/ChangePwd.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "file",
    component: File,
    redirect: "/transformationedit/" + new Date().getTime(),
    children: [
      {
        path: "/autotransformation",
        name: "autotransformation",
        component: AutoTransformation,
      },
      {
        path: "/transformationedit/:time",
        name: "transformationedit",
        component: TransformationEdit,
      },
      {
        path: "/contentsearch",
        name: "ContetSearch",
        component: () =>
          import("../views/ContetSearch.vue"),
      },
      {
        path: "/changerecord",
        name: "ChangeRecord",
        component: () =>
          import("../views/ChangeRecord.vue"),
      },
      {
        path: "/help",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/About.vue"),
      }
    ],
  },
  {
    path: "/userinfo",
    name: "userinfo",
    component: UserInfo,
    redirect: "/userbaseinfo",
    children: [
      {
        path: "/userbaseinfo",
        name: "userbaseinfo",
        component: UserBaseInfo,
      },
      {
        path: "/changepwd",
        name: "changepwd",
        component: ChangePwd,
      },
    ],
  },
  { path: "*", redirect: "/transformationedit/" + new Date().getTime() },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
