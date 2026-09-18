import Register from "./components/Register";
import Login from "./components/Login";
// 4.1.0 Let's add various components here so that, for the React Router test, we can simulate different pages with access based on different role types.
import Home from "./components/Home";
import Layout from "./components/Layout";
import Editor from "./components/Editor";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Lounge from "./components/Lounge";
import LinkPage from "./components/LinkPage";

// 4.1.3 Next, we'll need to import a couple of things to use React Router here. ↓
import {Routes, Route} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

// 4.7.3 So, we'll define an object with the roles up here and then use their keys below in the code then. (!But remember if somebody digs enough our JavaScript file, and it's viewable from the public, then maybe is better stick to just codes.) ↓
/*const ROLES = {
  "User": 2001,
  "Editor": 1984,
  "Admin": 5150,
};*/

function App() {
  // 4.1.1 Here, instead of inserting a page components directly inside the "main" tag we'll use special "Layout" component.
  // (Go to [src/components/Layout.js])
  // 4.1.4 Then, we're going to use "Routes" component here and the "Route" nested inside of it and insert that "Layout" component as the value of its prop "element". That's going to be the root route, so we'll set "/" for its "path" prop. And we'll just paste in all the page components we have and each one will be represented as a route.
  return (
    /*<main className="App">
      <Login/>
    </main>*/
    <Routes>
      {/* 4.1.5 So, we have a group of links labeled as "public" those are should be public, so that everyone has access to it. And we have here login & register pages, but also "linkpage" page, so that we can navigate and try out the other routes from there. Also, an unauthorized page that will show when someone isn't authorized and tries to access one of the protected routes. */}
      <Route path="/" element={<Layout/>}>
        {/* Public routes */}
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="linkpage" element={<LinkPage/>}/>
        <Route path="unauthorized" element={<Unauthorized/>}/>

        {/* 4.1.6 And also we have here some routes that we want to turn into protected routes (right now they're not). We have the homepage which has the root path. Then we have the "editor" and "admin" routes for the alike called user-based roles and the "lounge" that should be accessible to both "editor" & "admin" user-based roles. */}
        {/* 4.4 Now we can protect the routes with our "RequireAuth" component by wrapping them inside of it. */}
        {/* (Go to [src/components/Login.js]) */}
        {/* 4.7.0 Now, for each route that we want to protect, we have to pass in the "allowedRoles" array. To do so, we need to pass an "allowedRoles" attribute with an array as the value. For the home route, we'll use 2001, the "User" role. However, since we have three different roles, we'll use a wrapper route with "RequireAuth" as an element four times, each with a different value for the "allowedRoles" attribute. */}
        {/* 4.7.1 We don't need to specify the "User" role with the number 2001 for each route because every user gets the number 2001 by default in our system. Therefore, it's enough to specify the number 2001 for the root route with the path "/". However, if users in other systems get only one role, we could put all the different roles in the "allowedRoles" array in the root path. Of course, we can also nest more than one route inside the wrapper route with the "RequireAuth" element. */}
        {/* 4.7.2 That would be great if we knew what each code in our API meant, as well as the other developers who work with us. However, it may be necessary to be more descriptive and create a small helper object to make the roles more descriptive in the code. ↑ */}
        {/* 4.7.4 Next, we will replace the role codes with the key names from the ROLES object to make the code more self-descriptive. */}
        {/* (Go to [src/components/Unauthorized.js]) */}
        {/* Protected routes */}
        {/*<Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>*/}
        <Route element={<RequireAuth allowedRoles={[2001]}/>}>
          <Route path="/" element={<Home/>}></Route>
        </Route>
        {/*<Route element={<RequireAuth allowedRoles={[ROLES.Editor]}/>}>*/}
        <Route element={<RequireAuth allowedRoles={[1984]}/>}>
          <Route path="editor" element={<Editor/>}/>
        </Route>
        {/*<Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>*/}
        <Route element={<RequireAuth allowedRoles={[5150]}/>}>
          <Route path="admin" element={<Admin/>}/>
        </Route>
        {/*<Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Editor]}/>}>*/}
        <Route element={<RequireAuth allowedRoles={[5150, 1984]}/>}>
          <Route path="lounge" element={<Lounge/>}/>
        </Route>

        {/* 4.1.7 And then we have an extra path "catch all" essentially any request that doesn't match a path will go to this (usually it's 404 page, but for now we'll be showing "Missing" component for that). */}
        {/* 4.2.0 Now, let's look at how we're handling the global authentication state. We won't put the authentication inside the routes because we want to keep things clean and avoid any conditional logic. Instead, we'll handle it the way the React Router Docs recommend. To do so, we'll create a new directory called "hooks" and head in there. */}
        {/* (Go to [src/hooks/useAuth.js]) */}
        {/* Catch all */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  )
    ;
}

export default App;