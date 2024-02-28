/**
 * Spawns a simple cube with basic animation and state management
 */
class SimpleCubeAnimationWithState extends CapElement {
  schema = {};
  init() {
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.state.count = this.state.count + 1;
    this.requestUpdate();
  };

  render() {
    const { count } = this.state;

    return html`
      <a-circle
        class="ui"
        @click="${this.increment}"
        rotation="0 0 0"
        position="0 1.5 5"
        radius="0.2"
        color="#ff0000"
      >
        <a-troika-text value=${count}> </a-troika-text>
      </a-circle>
      <a-box
        id="box"
        class="interactable"
        position="3 1.5 5"
        color="#333"
        rotation="0 45 0"
        animation__position="property: position; from: 0 1.6 5; to: 0 1 5; startEvents: click"
        animation__color="property: color; from: #333; to: #ff0000; startEvents: click"
        animation__rotation="property: rotation; from: 0 45 0; to: 0 135 0; startEvents: click"
        animation-toggle="names: animation__position, animation__color, animation__rotation"
      >
      </a-box>
    `;
  }
}

export default SimpleCubeAnimationWithState;
