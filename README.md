# GifSearch

Check out the app running live here:<br>
[http://gif-search-gg.herokuapp.com](http://gif-search-gg.herokuapp.com)

## Installation
Clone this project, then run
```shell script
npm install
```

## Running

```shell script
# Run in development mode
npm start

# Run a production build (in prod)
npm start:prod
```

## Building 

```shell script
# Run a dev build
npm run build

# Run a prod build
npm run build:prod
``` 

## Tests and coverage
Current unit testing coverage is over 90%:
```
Statements   : 98.51% ( 66/67 )
Branches     : 91.67% ( 11/12 )
Functions    : 97.06% ( 33/34 )
Lines        : 98.28% ( 57/58 )
```

End-to-end tests I have decided not to extend for now because of time constraints. 
Usually I'd implement them at least for the critical flows.

## Some technical considerations
Folder structure has been kept as flat as possible, but I also had extensibility in mind by activating 
the routes, as well as separating the Giphy-related logic and bad words filter-related logic from the gif-search 
component to make it providers-agnostic.<br>
Since it's such a small SPA, a single module with everything packaged with it is more than enough,
transfer size is currently less than 550kb built. <br>
As it grows, the two gif search components can be moved into their own module, lazy-loaded based on the route.

To run in production, a simple Node server can handle a decent amount of static traffic to start. Later it can be 
migrated to nginx or Apache (or move the Node server behind nginx/Apache) which are better suited to serve static files.

Design-wise, for this prototype app I use Bootstrap - although it looks pretty old already, it's a battle-hardened framework 
and I chose it for its simplicity; interface is not where I chose to invest the most time.  I like Angular material's look 
more, it's definitely more modern and using Google's material design guidelines but the paginator was not good for what I 
needed here, much worse than ng-bootstrap's. 

Bad words filter does its job and it's pretty good for a prototype, but it's not the best, and can be quite easily fooled - 
in a bigger app an in-house implementation would be mandatory.
