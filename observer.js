/**
 * Observer 패턴 적용을 위함 함수 모음
 */
const global_state = {};

/**
 * 구독
 * @param {string} key 
 * @param {Observer} observer 
 */
export const subscribe = (key, observer) => {
  global_state[key].observers.add(observer);
};

/**
 * 구독해제
 * @param {string} key 
 * @param {Observer} observer 
 */
export const unsubscribe = (key, observer) => {
  global_state[key].observers.delete(observer);
};

/**
 * 구독하고 있는 객체들에게 상태 변경 통지
 * @param {string} key 
 */
const notify = (key) => global_state[key].observers.forEach((observer) => observer());

/**
 * 글로벌 상태 추가
 * @param {{key: string, default_value: any}}
 * @returns {string}
 */
export const initState = ({key, default_value}) => {
  if (key in global_state) return;
  global_state[key] = {
    state: default_value,
    observers: new Set(),
  };
  return key;
};

/**
 * 글로벌 상태 가져오기
 * @param {string} key 
 * @returns {any}
 */
export const getState = (key) => {
  if (!(key in global_state)) return null;
  return global_state[key].state;
};

/**
 * 글로벌 상태 수정
 * @param {string} key 
 * @returns {(any) => void}
 */
export const setState = (key) => (newState) => {
    if (!(key in global_state)) return;

    if (newState instanceof Function) {
      const state = getState(key);
      global_state[key].state = newState(state);
    } else {
      global_state[key].state = newState;
    }

    notify(key);
  };
