import Vue from 'vue'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from './components/nuxt-error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'

/* Plugins */

import nuxt_plugin_workbox_fa56eabe from 'nuxt_plugin_workbox_fa56eabe' // Source: .\\workbox.js (mode: 'client')
import nuxt_plugin_nuxticons_9c012cba from 'nuxt_plugin_nuxticons_9c012cba' // Source: .\\nuxt-icons.js (mode: 'all')
import nuxt_plugin_axios_53a5b2c5 from 'nuxt_plugin_axios_53a5b2c5' // Source: .\\axios.js (mode: 'all')
import nuxt_plugin_elementui_d905880e from 'nuxt_plugin_elementui_d905880e' // Source: ..\\plugins\\element-ui (mode: 'all')
import nuxt_plugin_vant_925e8cb6 from 'nuxt_plugin_vant_925e8cb6' // Source: ..\\plugins\\vant (mode: 'client')
import nuxt_plugin_filter_2aab3a6c from 'nuxt_plugin_filter_2aab3a6c' // Source: ..\\plugins\\filter (mode: 'client')
import nuxt_plugin_autopush_1568f31a from 'nuxt_plugin_autopush_1568f31a' // Source: ..\\plugins\\auto-push.js (mode: 'client')
import nuxt_plugin_loading_71bc50c8 from 'nuxt_plugin_loading_71bc50c8' // Source: ..\\plugins\\loading (mode: 'client')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

async function createApp (ssrContext) {
  const router = await createRouter(ssrContext)

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"sports-v-2","meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"全民体育_懂球迷的聚集地"},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"sports-v-2"},{"hid":"author","name":"author","content":"xll"},{"hid":"theme-color","name":"theme-color","content":"#fff"},{"hid":"og:type","name":"og:type","property":"og:type","content":"website"},{"hid":"og:title","name":"og:title","property":"og:title","content":"sports-v-2"},{"hid":"og:site_name","name":"og:site_name","property":"og:site_name","content":"sports-v-2"},{"hid":"og:description","name":"og:description","property":"og:description","content":"全民体育_懂球迷的聚集地"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"},{"rel":"manifest","href":"\u002F_nuxt\u002Fmanifest.55284235.json"},{"rel":"shortcut icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_64.2eeb4d.png"},{"rel":"apple-touch-icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_512.2eeb4d.png","sizes":"512x512"}],"script":[{"src":"\u002Fjquery-3.1.1.min.js","ssr":false},{"src":"\u002Fjquery.SuperSlide.2.1.3.js","ssr":false},{"src":"\u002FwxLogin.js","ssr":false},{"src":"https:\u002F\u002Fjs.users.51.la\u002F20532775.js","ssr":false},{"src":"\u002Fflexible.js","ssr":false}],"style":[],"htmlAttrs":{"lang":"en"}},

    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  const inject = function (key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Plugin execution

  if (process.client && typeof nuxt_plugin_workbox_fa56eabe === 'function') {
    await nuxt_plugin_workbox_fa56eabe(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxticons_9c012cba === 'function') {
    await nuxt_plugin_nuxticons_9c012cba(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_53a5b2c5 === 'function') {
    await nuxt_plugin_axios_53a5b2c5(app.context, inject)
  }

  if (typeof nuxt_plugin_elementui_d905880e === 'function') {
    await nuxt_plugin_elementui_d905880e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vant_925e8cb6 === 'function') {
    await nuxt_plugin_vant_925e8cb6(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_filter_2aab3a6c === 'function') {
    await nuxt_plugin_filter_2aab3a6c(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_autopush_1568f31a === 'function') {
    await nuxt_plugin_autopush_1568f31a(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_loading_71bc50c8 === 'function') {
    await nuxt_plugin_loading_71bc50c8(app.context, inject)
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, () => {
        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from, next) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    app,
    router
  }
}

export { createApp, NuxtError }
