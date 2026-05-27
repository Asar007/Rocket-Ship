import Layout from './Layout.jsx'

// react-router data routes. `lazy` returns a module exporting `Component`
// so each page is its own async chunk (per-page payload on slow wifi).
// vite-react-ssg prerenders every static path to its own HTML file.
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: () => import('./pages/Home.jsx') },
      { path: 'about', lazy: () => import('./pages/About.jsx') },
      { path: 'projects', lazy: () => import('./pages/Projects.jsx') },
      {
        path: 'customization',
        lazy: () => import('./pages/Customization.jsx'),
      },
      { path: 'contact', lazy: () => import('./pages/Contact.jsx') },
      // Literal /404 route so vite-react-ssg emits dist/404.html at build
      // time. Most hosts (Vercel, Netlify, GH Pages, Cloudflare Pages) auto
      // serve 404.html with a real HTTP 404 status for unmatched paths.
      { path: '404', lazy: () => import('./pages/NotFound.jsx') },
      // SPA catch-all for client-side navigation to non-existent routes.
      { path: '*', lazy: () => import('./pages/NotFound.jsx') },
    ],
  },
  { path: '/space', lazy: () => import('./pages/Space.jsx') },
  { path: '/cts-render', lazy: () => import('./pages/CTSRender.jsx') },
]
