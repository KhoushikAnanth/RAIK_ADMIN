import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { theme } from "./theme";
import Routes from "./routes";
import * as serviceWorker from "./serviceWorker";
import "react-spring-modal/dist/index.css";
import "overlayscrollbars/css/OverlayScrollbars.css";
import "components/Scrollbar/scrollbar.css";
import "./theme/global.css";
// import DemoSwitcher from 'components/DemoSwitcher/SwitcherBtn';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/custom/graphql"
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache()
});

function App() {
  const engine = new Styletron();

  return (
    <ApolloProvider client={client as any}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
          {/* <DemoSwitcher /> */}
        </BaseProvider>
      </StyletronProvider>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
