import React from 'react';
import ReactDOM, { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import {App} from './App';

import {Discover} from './components/Discover'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});



// Doesn't work yet because of redux
// let container: Element | null = null;
// beforeEach(() => {
//   // setup a DOM element as a render target
//   container = document.createElement("div");
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   // cleanup on exiting
//   if (container !== null) {
//     unmountComponentAtNode(container);
//     container.remove();
//     container = null;
//   }
// });

// it('discover renders fake data correctly', async() => {
//   const fakeSearchResult = {
//     users: [
//       {
//         user: 'fartface',
//         user_id: '1'
//       }
//     ]
//   }

//   jest.spyOn(global, 'fetch').mockImplementation(() => 
//     Promise.resolve({
//       json: () => Promise.resolve(fakeSearchResult)
//     })
//   )
//   await act( async () => {
//     render(<Discover currentUser=''/>, container)
//   });
//   debugger;
// }); 