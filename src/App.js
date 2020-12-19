import React, { useEffect } from "react";
import "./App.css";
import ImageUpload from "./ImageUpload";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import { auth } from "./Firebase";
import Feed from "./Feed";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/feed" component={Feed} />
        <Route exact path="/imageUpload" component={ImageUpload} />
        <Route exact path="/" component={SignUp} />
        <Route>
          <h2>Page not found</h2>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
