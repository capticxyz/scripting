/**
 * Spawns a simple cube with basic animation and state management
 */
class SimpleCubeAnimationWithState extends CapElement {
    @property()
    count: number = 0
    @query('#box')
    box

    init() {}

    increment = () => {
        this.count++

        // set the x coordinate of the box to the current count
        this.box.setAttribute('position', { x: this.count, y: 1.6, z: 5 })
    }

    render() {
        return html`
            <a-circle
                class="ui"
                @click="${this.increment}"
                rotation="0 0 0"
                position="0 1.5 -1"
                radius="0.2"
                color="#ff0000"
            >
                <cap-uix-text value=${this.count} font-size="0.1"> </cap-uix-text>
            </a-circle>
            <a-box
                id="box"
                class="interactable"
                position="3 1.5 -1"
                color="#333"
                rotation="0 45 0"
                animation__position="property: position; from: 0 1.6 5; to: 0 1 5; startEvents: click"
                animation__color="property: color; from: #333; to: #ff0000; startEvents: click"
                animation__rotation="property: rotation; from: 0 45 0; to: 0 135 0; startEvents: click"
                animation-toggle="names: animation__position, animation__color, animation__rotation"
            >
            </a-box>
        `
    }
}

export default SimpleCubeAnimationWithState
