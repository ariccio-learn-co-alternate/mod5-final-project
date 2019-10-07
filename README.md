# Yeet-for-cheats


A simple FPS with friend management, score tracking, and custom Typescript/Javascript 3d rendering. I'm rendering to a canvas element at 60 fps. I'd originally intended to use WebAssembly and C++ for the rendering, but it turns out I can squeeze 60 fps from Javascript! In theory, I could add more rendering features by intensively reusing variables (to reduce insanely expensive JS heap allocations), but at that point I'd rather go the WebAssembly route.

To build and launch:

* bundle install the dependencies for the Rails backend

* install yarn dependencies for the React frontend

* launch the backend with rails s --port 3001

* launch the frontend in the frontend directory with yarn start

WASD control player movement, the left and right arrows turn, and spacebar shoots. All sound effects are authentic @EvansJWang , sampled from live Flatiron School lectures.

See @ariccio for my non-flatiron work!
