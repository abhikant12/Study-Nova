import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"                 // importing all reducer which is made into slices;
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from "../slices/viewCourseSlice"

/*
here there are multiple reducer like authReducer , profileReducer , cartReducer etc  So we combine all reducer here
in "rootReducer"  and  this "rootReducer" is added into "store" in index.js now we can access all reducer using "store"
*/

const rootReducer  = combineReducers({                  // combining all reducer;
    auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})

export default rootReducer


/*
 syntax of a reducer :-  (state,action) => newState

  ex:-                              const initialState = {
                                        isLoading: false,
                                        items: []
                                        };

                                    const reducer = (state = initialState, action) => {

                                        switch (action.type) {
=
                                            case 'ITEMS_REQUEST':
                                                return Object.assign({}, state, {
                                                    isLoading: action.payload.isLoading
                                                })

                                            case ‘ITEMS_REQUEST_SUCCESS':
                                                return Object.assign({}, state, {
                                                    items: state.items.concat(action.items),
                                                    isLoading: action.isLoading
                                                })
                                            default:
                                                return state;
                                        }
                                    }
                                    export default reducer;



**Redux :-  it is used as a state management tool with React and it is an open-source JavaScript library used to manage application state. 
             React uses Redux for building the user interface .you can use it with any other JavaScript framework or library.0
             it creates a global state for the whole application, that can be accessed by any of your component

When working with Redux, you will need three main things:
1) actions:  it have two properties, one describing the type of action, and one describing what should be changed in the app state.
2) reducers: these are functions that implement the behavior of the actions. 
3) store:  it brings the actions and reducers together, holding and changing the state for the whole app — there is only one store.

State is Read-only in Redux. What makes Redux predictable is that to make a change in the state of the application, we need to dispatch an 
action which describes what changes we want to make in the state. These actions are then consumed by something known as **reducers**,



**Reducer :-  reducer is a function that is able to process our message, our Action. it take in two things: previous state and an action. 
             Then they reduce it  to one entity: the new updated instance of state. So reducers are basically pure JS functions which 
              take in the previous state and an action and return the newly updated state.2
 
Whenever an action is dispatched, all the reducers are activated. Each reducer filters out the action using a switch statement switching on
the action type. Whenever the switch statement matches with the action passed, the corresponding reducers take the necessary action to make 
the update and return a fresh new instance of the global state.



**Why Use Redux?
Let's take an e-commerce website for example. An e-commerce website will have  components like the cart component . We'll take the cart 
component which displays the number of items in a user's cart. The state of the cart component will consist of all the  items the user has 
added to the cart and the total number of those items. At all times the application is up and running, this component has to show the updated
number of items in the user's cart. Whenever a user adds an item to the cart, the application has to internally handle that action by adding 
that item to the cart object. It has to maintain its state internally and also show the user the total number of items in the cart in the UI.
Similarly, removing an item from the cart.
   
This is where Redux comes into the picture. Being a state management library, Redux will basically store and manage all the application's 
states.





*/