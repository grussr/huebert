import React, { useEffect, createRef } from "react";
import { connect } from "react-redux";
import { Menu, Sticky, Ref, Transition, List } from "semantic-ui-react";

import {
  fetchGroups,
  deleteGroup,
  addLight,
  removeLight,
  setActiveGroup,
  setView,
  setTheme,
  toggleExpanded
} from "../../actions";
import LightsTable from "./LightsTable";
import LightsList from "./LightsList";
import ScenesList from "../ScenesList";
import ColorPicker from "../ColorPicker";
import CenterPanel from "../CenterPanel";
import ToolPanel from "../ToolPanel";
import CreateGroupModal from "../modals/CreateGroupModal";
import DeleteItemModal from "../modals/DeleteItemModal";

const CARD = "card";
const LIST = "list";

const HomeView = ({
  lights,
  groups,
  active,
  settings,
  fetchGroups,
  deleteGroup,
  addLight,
  removeLight,
  setActiveGroup,
  setView,
  toggleExpanded
}) => {
  const contextRef = createRef();

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = () => {
    if (active.group) {
      deleteGroup(active.group.id, active.group.name);
      setActiveGroup(null);
    } else if (active.light) {
      removeLight(active.light);
    }
  };

  const renderToolbar = () => {
    return (
      <Menu
        inverted={settings.theme === "inverted"}
        size="mini"
        icon
        onClick={e => e.stopPropagation()}
      >
        <Menu.Item
          link
          active={settings.view !== CARD}
          title="List View"
          icon="list"
          onClick={() => setView(LIST)}
        />
        <Menu.Item
          link
          active={settings.view === CARD}
          icon="th"
          title="Card View"
          onClick={() => setView(CARD)}
        />
        <Menu.Item
          link
          title={`${settings.expandAll ? "Collapse" : "Expand"} All`}
          icon={`angle double ${settings.expandAll ? "up" : "down"}`}
          onClick={toggleExpanded}
        />
        {/* <div className="item" style={{ width: 48 }} />
        <div className="menu">
          
          <div className={`disabled link item`} title="Filter Groups">
            <i className="filter icon"></i>
          </div>
          <div className={`disabled link item`} title="Edit Groups">
            <i className="edit icon"></i>
          </div>
          
        </div> */}
        <Menu.Menu position="right">
          <CreateGroupModal
            lights={lights}
            theme={settings.theme}
            trigger={<Menu.Item link title="Create Group" icon="plus" />}
          />
          <DeleteItemModal
            active={active}
            theme={settings.theme}
            onSubmit={handleDelete}
            trigger={
              <Menu.Item
                link
                disabled={!(active.light || active.group)}
                title="Delete"
                icon="trash"
              />
            }
          />
        </Menu.Menu>
      </Menu>
    );
  };

  const renderTables = () => {
    return groups.map(group => {
      return (
        // <List.Item key={group.id}>
        <LightsTable
          group={group}
          lights={lights.filter(light => group.lights.includes(light.id))}
          expanded={settings.expanded.includes(group.id)}
          key={group.id}
        />
        // </List.Item>
      );
    });
  };

  const renderCards = () => {
    return (
      <LightsList groups={groups} lights={settings.expandAll ? lights : []} />
    );
  };

  return (
    <>
      <Ref innerRef={contextRef}>
        <CenterPanel onClick={() => setActiveGroup(null)}>
          <Sticky context={contextRef} offset={16}>
            {renderToolbar()}
          </Sticky>
          {/* <Transition.Group animation="fade right" duration={500} as={List}> */}
            {settings.view === CARD ? renderCards() : renderTables()}
          {/* </Transition.Group> */}
        </CenterPanel>
      </Ref>
      <ToolPanel>
        {active.light || active.group ? <ColorPicker /> : null}
        {active.group ? <ScenesList /> : null}
      </ToolPanel>
    </>
  );
};

const mapStateToProps = state => {
  return {
    lights: state.lights,
    groups: state.groups,
    active: state.active,
    settings: state.settings
  };
};

export default connect(mapStateToProps, {
  fetchGroups,
  deleteGroup,
  addLight,
  removeLight,
  setActiveGroup,
  setView,
  setTheme,
  toggleExpanded
})(HomeView);
