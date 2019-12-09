import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { Grid, Menu } from "semantic-ui-react";

import { fetchGroups, initializeApp, setTheme } from "../actions";
import NavigationMenu from "./NavigationMenu";
import Info from "./Info";
import RoomsList from "./RoomsList";
import RulesList from "./RulesList";
import Setup from "./Setup";
import useRefresh from "../hooks/useRefresh";
import GroupsView from "./home/GroupsView";
import ToolPanel from "./ToolPanel";

const INVERTED = "inverted";

const App = props => {
  // FIXME: Should use the fetchAll() function, once I make it
  const { refresh, cancel } = useRefresh(props.fetchGroups, 5000);

  useEffect(() => {
    props.initializeApp();
    refresh();

    return cancel;
  }, []);

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: props.settings.theme === INVERTED ? "#080808" : "white"
      }}
    >
      <Grid style={{ overflowY: "hidden", height: "99.5vh" }}>
        <ToolPanel>
          <NavigationMenu location={props.location} />
          <Info />
          <Menu inverted={props.settings.theme === INVERTED} size="mini" icon>
            <Menu.Item
              active={props.settings.theme === INVERTED}
              title="Toggle Dark Mode"
              icon="adjust"
              onClick={() =>
                props.setTheme(
                  props.settings.theme === INVERTED ? null : INVERTED
                )
              }
            />
          </Menu>
        </ToolPanel>
        <Switch>
          <Route exact path="/" component={GroupsView} />
          <Route exact path="/groups" component={RoomsList} />
          <Route exact path="/schedules" />
          <Route exact path="/rules" component={RulesList} />
          <Route exact path="/sensors" />
          <Route exact path="/settings" component={Setup} />
          <Redirect to={!props.settings.config ? "/settings" : "/"} />
        </Switch>
      </Grid>
    </div>
  );
};

const mapStateToProps = state => {
  return { settings: state.settings };
};

export default withRouter(
  connect(mapStateToProps, {
    fetchGroups,
    initializeApp,
    setTheme
  })(App)
);
