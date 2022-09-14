# Simple React Router

You can use this router for both React web applications and React Native.

> Warning: If your npm version not supported peerDependencies. You should  install th12storage. "npm install th12storage".

# Getting Started
## Simple example (React Web).
```javascript
    import { Router, Link, useParams, usePath } from "th12router";

    // Main component
    function Home(){
        return  <div>
                    Home
                </div>;
    }

    function App() {
        // Description of routes
        let routes = [
            {"path": "/", "component": Home, "private": null}
        ];
        
        // Return JSX
        return (
            <div className="App">
                <Router routes={routes} />
            </div>
        );
    }

export default App;
```

# Documentation
## Imports:
- Router;
- Link;
- useParams;
- usePath.

## Router
This is the main component. It loads all router components.

```html
    <Router routes={routes} />
```

Router use routes array.

```javascript
    let routes = [
        {"path": "/pagenotfound", "component": PageNotFound, "private": null},
        {"path": "/", "component": Home, "private": null},
        {"path": "/user/:id&^[0-9]+", "component": User, "private": true},
        {"path": "/lazy", "component": Lazy, "private": null}
    ];
```

path - This is the path by which you need to download the router. You can use params and regular expressions.
For example: /user/:id&^[0-9]+
A colon indicates that a parameter is used.
An Ampersand indicates that a regular expressions is used.

component - The component to be downloaded.

private - The parameter that tells whether to load the component during authorization or not. If null is specified, the component is loaded in any case.

## Link
This is an interface for interacting with the router.

```html
    <Link 
        to="/" 
        style={{"color": "red"}}
        astyle={{"color": "green"}}
        timer="1000"
        title=""
        pstate
    >To Home</Link>
```
Description:
- to(path);
- style(css style);
- astyle(css style active link "onMouseDown event");
- timer(delay activet link after mousedown);
- title(browser title if set pstate);
- pstate(history push state).

## useParams
If you use parameters in a router, you can load the parameters into a component.

```javascript
    let params = useParams();
    console.log(params["id"]);
```

## usePath
A hook to get the current path.

```javascript
    let path = usePath();
    console.log(path);
```

# Additional Information

## Lazy components

If you want to load lazy components. You need to use the React.Suspense component.

```javascript
    const Lazy = React.lazy(() => import("./Lazy.jsx"))

    let routes = [
        {"path": "/pagenotfound", "component": PageNotFound, "private": null},
        {"path": "/", "component": Home, "private": null},
        {"path": "/user/:id&^[0-9]+", "component": User, "private": true},
        {"path": "/lazy", "component": Lazy, "private": null}
    ];
```

```html
    <React.Suspense fallback={<React.Fragment>...</React.Fragment>}>
                <Router routes={routes} />
            </React.Suspense>
```

## Initialization

```javascript
    import { useStorage } from "th12storage";
```

```javascript
    // Initial path if need
    useStorage("routerPage", window.location.pathname);
    // App auth if need
    useStorage("routerAuth", true);
```

# Full React Web example

```javascript
    import React from "react";
    import { Router, Link, useParams, usePath } from "th12router";
    import { useStorage } from "th12storage";

    // Page Not Found component
    function PageNotFound(){
        let path = usePath();
        return  <div>
                    Page not found({path})! 
                    <Link to="/" style={{"color": "red"}} pstate>To Home</Link>
                </div>;
    }

    // Main component
    function Home(){
        return  <div>
                    Home
                    <Link astyle={{"color":"green"}} to="/user/1" title="About us" pstate>Profile</Link>
                    <Link to="/lazy" pstate>To Lazy</Link>
                </div>;
    }

    // Componenet with params and regular expresion. /user/:id&^[0-9]+
    // And component with bad path. Waiting for Page Not Found component to load.
    function User(){
        let params = useParams();
        
        return  <div>
                    User {params["id"]}!
                    <Link to="/otherway" pstate>To Home</Link>
                </div>;
    }

    export default function App() {
        // Lazy load component
        const Lazy = React.lazy(() => import("./Lazy.jsx"))

        let routes = [
            {"path": "/pagenotfound", "component": PageNotFound, "private": null},
            {"path": "/", "component": Home, "private": null},
            {"path": "/user/:id&^[0-9]+", "component": User, "private": true},
            {"path": "/lazy", "component": Lazy, "private": null}
        ];

        useStorage("routerPage", window.location.pathname);
        useStorage("routerAuth", true);
        
        return (
            <div className="App">
                <React.Suspense fallback={<React.Fragment>...</React.Fragment>}>
                    <Router routes={routes} />
                </React.Suspense>
            </div>
        );
    }
```

# Full React Native example
```javascript
    import React from "react";
    import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
    import { Router, Link, useParams, usePath } from "th12router";
    import { useStorage } from "th12storage";

    // Page Not Found component
    function PageNotFound(){
        let path = usePath();
        return  <Text>
                    Page not found({path})! 
                    <Link to="/" style={{"color": "red"}}>To Home</Link>
                </Text>;
    }

    // Main component
    function Home(){
        return  <Text>
                    Home
                    <Link astyle={{"color":"green"}} to="/user/1" title="About us" pstate>Profile</Link>
                </Text>;
    }

    // Componenet with params and regular expresion. /user/:id&^[0-9]+
    // And component with bad path. Waiting for Page Not Found component to load.
    function User(){
        let params = useParams();
    
        return  <Text>
                    User {params["id"]}!
                    <Link to="/otherway">To Home</Link>
                </Text>;
    }

    export default function App() {
        let routes = [
            {"path": "/pagenotfound", "component": PageNotFound, "private": null},
            {"path": "/", "component": Home, "private": null},
            {"path": "/user/:id&^[0-9]+", "component": User, "private": true}
        ];

        useStorage("routerPage", "/");
        useStorage("routerAuth", true);

        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.container}>
                    <Router routes={routes} />
                </View>
            </SafeAreaView>
        );
    }

    const styles = StyleSheet.create({
        safe: {
            flex: 1,
            marginTop: StatusBar.currentHeight
        },
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });
```