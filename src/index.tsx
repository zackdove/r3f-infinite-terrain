/**
 * @class ExampleComponent
 */

import { Component } from "react";

export type Props = { text: string };

export default class ExampleComponent extends Component<Props> {
  render() {
    const { text } = this.props;

    return <div style={{ color: "red" }}>Hello {text}</div>;
  }
}
