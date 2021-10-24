import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//COMPONENTS
import Posts from 'containers/Posts';

function App(props) {
  const pageLoadTime = new Date().getTime();

  return (
    <React.Suspense
      fallback={
        <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          loading...
        </div>
      }
    >
      <Router>
        <Switch>
          <Route path="/:id" render={(props) => (<Posts {...props} pageLoadTime={pageLoadTime} />)} />
        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;