import React from "react";

import Header from "./Header";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

import { useAuth0 } from "./Auth/react-auth0-spa";

const createApolloClient = (authToken) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://innocent-drum-67.hasura.app/v1/graphql',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'X-Hasura-User-Id':user.sub,
        'X-Hasura-Role':'user',
        'x-hasura-access-key':'y6kBpvBl0KFWqhsV9YcZNPpow2ASL5QESUPZCOb2afFZGvehnR4F1MuVGnbLL0v2 '
      }
    }),
    cache: new InMemoryCache(),
  });
 }; 


const App = ({ idToken }) => {
  const { user, loading, logout } = useAuth0();
  console.log(user)
  if (loading || !idToken) {
    return <div>Loading...</div>;
  }
  const client = createApolloClient(idToken);
  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={logout} />
        <div className="row container-fluid p-left-right-0 m-left-right-0">
          <div className="row col-md-9 p-left-right-0 m-left-right-0">
            <div className="col-md-6 sliderMenu p-30">
              <TodoPrivateWrapper />
            </div>
            <div className="col-md-6 sliderMenu p-30 bg-gray border-right">
            
            </div>
          </div>
          <div className="col-md-3 p-left-right-0">
            <div className="col-md-12 sliderMenu p-30 bg-gray">
            
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
