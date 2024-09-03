class UixElement extends CapElement {
    @query('#player-rig')
    playerRig

    @query('#button1')
    button1

    init() {
        // this.el.sceneEl reference to A-Frame a-scene
        // this.el.sceneEl.renderer refers to the Three.js renderer
        this.el.sceneEl.renderer.debug.checkShaderErrors = false
    }

    // Do something on every scene tick or frame.
    tick = (time: number, deltaTime: number) => {}

    // Optional Render TemplateResult
    render() {
        return html`
            <cap-uix-card
                width="5"
                height="2"
                position="2 2.5 0"
                color="white"
                border-color="#c33664"
                radius="0.25"
            >
                <cap-uix-layout
                    position="0 1 0"
                    columns="1"
                    margin-column="0.5"
                    margin-row="0.12"
                    align="center"
                >
                    <cap-uix-button
                        id="button1"
                        disabled="true"
                        color="#c33664"
                        @click=${(ev) => {
                            console.info(ev.target.getAttribute('disabled'))
                        }}
                        position="0 0 0.001"
                    >
                        <cap-uix-text
                            position="0 0 0"
                            font-size="0.04"
                            value="Label"
                            color="white"
                        />
                        <cap-uix-icon
                            icon="restart_alt"
                            size="0.07"
                            color="white"
                            position="-0.12 0 0.01"
                        />
                    </cap-uix-button>
                    <cap-uix-button
                        disabled="false"
                        color="green"
                        @click=${() => {
                            console.info('click')
                            button1.setAttribute('disabled', false)
                        }}
                        position="0 0 0.001"
                    >
                        <cap-uix-text
                            position="0 0 0"
                            font-size="0.04"
                            value="Label"
                            color="white"
                        />
                    </cap-uix-button>
                    <cap-uix-button
                        color="red"
                        @click=${() => {
                            console.info('click')
                        }}
                        position="0 0 0.001"
                    >
                        <cap-uix-text
                            position="0 0 0"
                            font-size="0.04"
                            value="Label"
                            color="white"
                        />
                    </cap-uix-button>
                    <cap-uix-button
                        color="blue"
                        @click=${() => {
                            console.info('click')
                        }}
                        position="0 0 0.001"
                    >
                        <cap-uix-text
                            position="0 0 0"
                            font-size="0.04"
                            value="Label"
                            color="black"
                        />
                    </cap-uix-button>

                    <cap-uix-button
                        color="black"
                        @click=${() => {
                            console.info('click')
                        }}
                        position="0 0 0.001"
                    >
                        <cap-uix-text
                            position="0 0 0"
                            font-size="0.04"
                            value="Label"
                            color="white"
                        />
                    </cap-uix-button>
                    <cap-uix-button
                        width="0.1"
                        height="0.1"
                        radius="0.05"
                        color="black"
                        @click=${() => {
                            console.info('click')
                        }}
                        position="0 0 0.001"
                    >
                        <cap-uix-icon icon="close" color="white" position="0 0 0.01" />
                    </cap-uix-button>
                    <cap-uix-switch value="true" position="0 0 0.001"> </cap-uix-switch>

                    <cap-uix-slider
                        value="0.5"
                        position="0 0 0.001"
                        @valuechange=${(ev: CustomEvent) => {
                            console.info(ev)
                        }}
                    >
                        <cap-uix-text position="0 0 0" value="Label" color="black" />
                    </cap-uix-slider>
                </cap-uix-layout>
            </cap-uix-card>
            <cap-uix-card-box
                width="0.55"
                height="0.2"
                position="-3 2 0"
                border-radius="0.01"
            ></cap-uix-card-box>
        `
    }
}

export default UixElement
