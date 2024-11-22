class WayPointElement extends CapElement {
    // Use @query to get references to the DOM elements.
    @query('#player-rig')
    playerRig?: HTMLElement

    @query('#dek')
    dek?: HTMLElement

    init(): void {
        const { href } = window.location
        const url = new URL(href)
        const waypoint: string | null = url.searchParams.get('waypoint')

        if (!waypoint) {
            console.warn('No waypoint specified in the URL parameters.')
            return
        }

        console.log('Waypoint Name:', waypoint)

        // Get the element with the specified waypoint id
        const targetElement: HTMLElement | null = this.dek
        if (!targetElement) {
            console.error(`Element with id "${waypoint}" not found.`)
            return
        }

        const position: string | null = targetElement.getAttribute('position')
        if (!position) {
            console.error(`No position attribute found for element with id "${waypoint}".`)
            return
        }

        console.log('Waypoint Position:', position)

        if (!this.playerRig) {
            console.error('Player rig element not found.')
            return
        }

        this.playerRig.setAttribute('position', position)
        console.log('Player rig position updated:', position)
    }

    // Do something on every scene tick or frame.
    tick = (time: number, deltaTime: number): void => {
        // No implementation provided; left as-is for future customization.
    }

    // Optional Render TemplateResult
    render(): TemplateResult {
        return html`
            <a-box
                position="2 1 3"
                rotation="45 45 0"
                color="#4CC3D9"
                width="2"
                height="2"
                depth="2"
                class="ui"
                id="dek"
                @click="${() => console.info('Box clicked')}"
            ></a-box>
        `
    }
}

export default WayPointElement
