/**
 * Spawns a simple cube with basic animation and state management
 */
class SimpleCubeAnimationWithState extends CapElement {
    @property()
    openCount = 0
    @query('#chest-lid')
    chestLid
    @query('#chest-sound')
    chestSound
    @property()
    count: number = 0
    @query('#box')
    box

    @query('#player-rig')
    playerRig

    init() {}
    /**
     * Opens the treasure chest.
     */
    openChest = () => {
        // Increment the open count.
        this.openCount++

        // Rotate the chest lid to open it.
        this.chestLid.setAttribute('rotation', '90 0 0')

        // Play the chest opening sound.
        this.chestSound.play()
    }
    increment = () => {
        this.count++

        // Update the cube's position.
        this.box.setAttribute('position', `${this.count} 1.6 5`)

        // Update the player rig's position if it exists.
        if (this.playerRig) {
            this.playerRig.setAttribute('position', `${this.count + 1} 0 5`)
        }
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
                material="roughness:0"
                animation__position="property: position; from: 0 1.6 5; to: 0 1 5; startEvents: click"
                animation__color="property: color; from: #333; to: #ff0000; startEvents: click"
                animation__rotation="property: rotation; from: 0 45 0; to: 0 135 0; startEvents: click"
                animation-toggle="names: animation__position, animation__color, animation__rotation"
            >
            </a-box>

            <a-entity>
                <a-box
                    id="chest-base"
                    position="0 0.5 0"
                    width="1"
                    height="1"
                    depth="1"
                    color="#8B4513"
                    material="roughness:0"
                ></a-box>
                <a-box
                    class="interactable"
                    id="chest-lid"
                    position="0 1 0"
                    width="0.9"
                    height="0.1"
                    depth="0.9"
                    color="#FFD700"
                    animation__open="property: rotation; from: 0 0 0; to: 90 0 0; startEvents: click"
                    @click="${this.openChest}"
                ></a-box>
                <cap-uix-text
                    value="Opened: ${this.openCount}"
                    position="0 0.2 0.6"
                    font-size="0.1"
                >
                </cap-uix-text>
            </a-entity>
            <audio
                id="chest-sound"
                src="https://cdn.pixabay.com/audio/2022/03/15/audio_1c85cdc785.mp3"
            ></audio>
        `
    }
}

export default SimpleCubeAnimationWithState
