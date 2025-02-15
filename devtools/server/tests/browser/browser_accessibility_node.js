/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Checks for the AccessibleActor

add_task(async function () {
  let {client, walker, accessibility} =
    await initAccessibilityFrontForUrl(MAIN_DOMAIN + "doc_accessibility.html");

  let a11yWalker = await accessibility.getWalker(walker);
  let buttonNode = await walker.querySelector(walker.rootNode, "#button");
  let accessibleFront = await a11yWalker.getAccessibleFor(buttonNode);

  checkA11yFront(accessibleFront, {
    name: "Accessible Button",
    role: "pushbutton",
    value: "",
    description: "Accessibility Test",
    help: "",
    keyboardShortcut: "",
    childCount: 1,
    domNodeType: 1
  });

  info("Actions");
  let actions = await accessibleFront.getActions();
  is(actions.length, 1, "Accessible Front has correct number of actions");
  is(actions[0], "Press", "Accessible Front default action is correct");

  info("Index in parent");
  let index = await accessibleFront.getIndexInParent();
  is(index, 1, "Accessible Front has correct index in parent");

  info("State");
  let state = await accessibleFront.getState();
  SimpleTest.isDeeply(state,
    ["focusable", "selectable text", "opaque", "enabled", "sensitive"],
    "Accessible Front has correct states");

  info("Attributes");
  let attributes = await accessibleFront.getAttributes();
  SimpleTest.isDeeply(attributes, {
    "margin-top": "0px",
    display: "inline-block",
    "text-align": "center",
    "text-indent": "0px",
    "margin-left": "0px",
    tag: "button",
    "margin-right": "0px",
    id: "button",
    "margin-bottom": "0px"
  }, "Accessible Front has correct attributes");

  info("Children");
  let children = await accessibleFront.children();
  is(children.length, 1, "Accessible Front has correct number of children");
  checkA11yFront(children[0], {
    name: "Accessible Button",
    role: "text leaf"
  });

  info("DOM Node");
  let node = await accessibleFront.getDOMNode(walker);
  is(node, buttonNode, "Accessible Front has correct DOM node");

  let a11yShutdown = waitForA11yShutdown();
  await client.close();
  forceCollections();
  await a11yShutdown;
  gBrowser.removeCurrentTab();
});
