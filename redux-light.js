// getState, dispatch, subscribe 

function createStore(reducer, initialState) {
  let listeners = []; // all our entities that care about state changes
  let currentState = initialState // we can pre-populate state with whatever (just a json obj)

  function getState() {
    return currentState;
  }

  // each listener is a function
  function subscribe(listener) {
    // keeping track of which entities want to be notified of state changes
    listeners.push(listener);

    return function unsubscribe() {
      // find the 'listener' that was passed in
      // and remove them from our array of listeners

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }

  // when an action dispatched the state can update or it could stay the same
  function dispatch(action) {
    // the new currentState is the result of calling the reducer function with
    // old state and an action
    currentState = reducer(currentState, action)

    // NOTE: if this doesn't work look here
    listeners.forEach(function(entityListening) {
      entityListening()
    });
  }


  return {
    getState: getState,
    dispatch: dispatch,
    subscribe: subscribe,
  }
}

const state = 1;

function myReducer(state, action) {
  if (action.type === 'INCREMENT') {
    return state + 1;
  }
  return state;
}

const store = createStore(myReducer, state);

console.log("INITIAL STATE: ", store.getState());

console.log("ABOUT TO DISPATCH ACTION");
store.dispatch({ type: 'INCREMENT' }); // action our reducer cares about

console.log("NEXT STATE: ", store.getState());
store.dispatch({ type: 'WTF' });
console.log("NEXT STATE: ", store.getState());

// A listener was added
store.subscribe(function needyPerson() {
  console.log('HEY A SUBSCRIBED FUNCTION WAS CALLED');
});

store.dispatch({ type: 'INCREMENT' }); 
console.log("NEXT STATE AFTER SUBSCRIBED: ", store.getState());



