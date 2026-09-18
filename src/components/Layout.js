// 4.1.2 We'll import "Outlet" component from React Router lib and this component represents all the children of "Layout" component. So, anything nested inside the "Layout" component. It allows us to apply more things to our overall app if we want to. We also can have "Header" & "Footer" components, or we can use more than one "Outlet" inside. So, this is just a fairly basic example for this tutorial.
// (Go to [src/App.js])
import {Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <main className="App">
      <Outlet/>
    </main>
  );
};

export default Layout;