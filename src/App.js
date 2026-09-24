import {Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Editor from "./components/Editor";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Lounge from "./components/Lounge";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Public routes */}
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="linkpage" element={<LinkPage/>}/>
        <Route path="unauthorized" element={<Unauthorized/>}/>

        {/* 6.3 Now, we need to wrap around all our protected routes with "PersistLogin" comp. And that's all we really want to do here with the routing. Again, in "App" comp. when we're using React Router 6 we don't want logic here, we just want to route and have the components. All the logic should be contained within those components. And our "Layout" comp. as well as our "PersisLogin" comp. now both make use of that "Outlet" that represents the child components (or routes if you will). */}
        {/* (Go to [src/hooks/useLogout.js]) */}
        {/* Protected routes */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={[2001]}/>}>
            <Route path="/" element={<Home/>}></Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[1984]}/>}>
            <Route path="editor" element={<Editor/>}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[5150]}/>}>
            <Route path="admin" element={<Admin/>}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[5150, 1984]}/>}>
            <Route path="lounge" element={<Lounge/>}/>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  );
}

export default App;