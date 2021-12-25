import {initState, setState} from './observer';

/**
 * Router 클래스
 * 
 * Web API popstate를 활용한 CSR 브라우저 라우터
 */
export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.current_index = 0;
    this.setPage = setState(router_state);
    this.init();
  }

  init() {
    history.replaceState({index: 0}, '');
    window.addEventListener('popstate', this.handlePopstate.bind(this));
    this.handlePopstate();
  }

  setRoutes(routes) {
    this.routes = routes;
    this.handlePopstate();
  }

  handlePopstate() {
    const current_path = location.pathname;

    let Page;
    let params;

    this.routes.forEach(({path, component}) => {
      if (this.match(path, current_path)) {
        Page = component;
        params = params = this.parseParams(path, current_path);
      }
    });

    if (!Page) {
      this.replace('/');
      return;
    }

    this.setPage({Page, params});
    this.current_index = history.state.index;
  }

  push(pathname) {
    history.pushState({index: this.current_index + 1}, '', pathname);
    this.handlePopstate();
  }

  replace(pathname) {
    history.replaceState({index: this.current_index}, '', pathname);
    this.handlePopstate();
  }

  clear(pathname) {
    history.replaceState({index: 0}, '', pathname);
    this.handlePopstate();
  }

  pop() {
    if (!this.current_index) {
      history.pushState({index: this.current_index - 1}, '', '/');
      this.handlePopstate();
      return;
    }
    history.back();
  }

  match(current_path, path) {
    const route_chunks = current_path.split('/');
    const chunks = path.split('/');

    if (route_chunks.length !== chunks.length) {
      return false;
    }

    for (let i = 0; i < chunks.length; i++) {
      if (route_chunks[i][0] === ':' || route_chunks[i] === chunks[i]) {
        continue;
      }
      return false;
    }
    return true;
  }

  parseParams(current_path, path) {
    const params = {};

    const route_chunks = current_path.split('/');
    const chunks = path.split('/');

    for (let i = 0; i < chunks.length; i++) {
      if (route_chunks[i][0] !== ':') {
        continue;
      }

      params[route_chunks[i].slice(1)] = chunks[i];
    }

    return params;
  }

  isBack(index) {
    return index < this.current_index;
  }
}

export const router_state = initState({
  key: 'router-state',
  default_value: {Page: null},
});
