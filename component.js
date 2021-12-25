import {subscribe, unsubscribe} from './observer';
import reconciliate from './reconciliate';

/**
 * Component 클래스
 * 
 * React와 유사한 방식으로 개발할 수 있도록 간단하게 만들어놓은 라이브러리.
 * 이전에 사용했던 클래스형 컴포넌트의 방식을 적용하여 개발.
 */
 class Component {
  /**
   * 컴포넌트 클래스
   * @param {HTMLElement} $target 
   * @param {any} props 
   */
  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.keys = [];
    this.#init();
  }

  /**
   * @private
   * 컴포넌트 초기화 메소드
   */
  #init() {
    this.initState();
    this.setObserverKeys();
    this.subscribe();
    this.setEvents();
    this.#render();
    this.componentDidMount();
  }

  /**
   * State 설정을 위한 메소드
   */
  initState() {}

  /**
   * 렌더될 문자열 템플릿을 출력하기 위한 메소드
   */
  render() {}

  /**
   * @private
   * 실제 렌더링을 담당하는 메소드
   */
  #render() {
    const template = this.render();
    reconciliate(this.$target, template);
    this.mountChildren();
  }

  /**
   * 자식 요소를 추가하기 위한 메소드
   */
  mountChildren() {}

  /**
   * 이벤트를 할당하기 위한 메소드
   */
  setEvents() {}

  /**
   * 이벤트를 할당하는 메소드
   * @param {Event} event_type 
   * @param {string} selector 
   * @param {() => void} handler
   */
  addEvent(event_type, selector, handler) {
    const children = this.$target.querySelectorAll(selector);
    
    this.$target.addEventListener(event_type, (e) => {
      const is_target = Array.from(children).includes(e.target) || e.target.closest(selector);
      if (!is_target) {
        return false;
      }

      handler(e);
    })
  }

  /**
   * 최초 마운트시 실행되는 메소드
   */
  componentDidMount() {}

  /**
   * State 변경을 위한 메소드
   * @param {any} newState 
   */
  setState(newState) {
    if (newState instanceof Function) {
      this.state = {...this.state, ...newState(this.state)};
    } else {
      this.state = {...this.state, ...newState};
    }
    this.#render();
  }

  /**
   * 글로벌 state 구독을 위한 key 설정
   */
  setObserverKeys() {}
  /**
   * @private
   * 글로벌 state 구독시 상태변경 통지가 올 때 리렌더링을 위한 메소드
   */
  #renderByObservation() {
    this.unsubscribe();
    this.#render();
  }
  /**
   * 구독을 위한 key설정 후 key를 바탕으로 구독을 하는 메소드
   */
  subscribe() {
    this.keys.forEach((key) => subscribe(key, this.#renderByObservation.bind(this)));
  }
  /**
   * 구독해제 메소드
   * @param {boolean} is_current_component 
   */
  unsubscribe(is_current_component = true) {
    if (!is_current_component && this.keys.length === 0) {
      this.keys.forEach((key) => unsubscribe(key, this.#renderByObservation.bind(this)));
    }
  }
}

export default Component;
