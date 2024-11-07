interface BoardPosition {
    x: number
    y: number
}

interface WinInfo {
    player: string
    start: BoardPosition
    end: BoardPosition
}

class TicTacToeElement extends CapElement {
    @property()
    currentPlayer: string = 'X'

    @property()
    board: string[][] = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]

    @property()
    turn: number = 0
    @property()
    playing: boolean = true

    @property()
    message: string = ''

    @query('#winner')
    syncNetworkedEl!: HTMLElement

    @query('#winning-line')
    lineNetworkedEl!: HTMLElement

    init() {
        // this.el.sceneEl reference to A-Frame a-scene
        // this.el.sceneEl.renderer refers to the Three.js renderer
    }

    // Do something on every scene tick or frame.
    tick = (time: number, deltaTime: number) => {}

    #placeMark(line: number, column: number): void {
        if (!this.playing) return
        this.currentPlayer = this.turn % 2 === 0 ? 'X' : 'O'

        const pawns = this.board
        const player = this.currentPlayer

        if (pawns[line][column] !== '') {
            return
        }
        pawns[line][column] = player

        NAF.utils.takeOwnership(this.syncNetworkedEl)

        this.board = pawns
        this.turn++
        const win = this.#determineWinner(this.board, 3)
        if (win) {
            this.message = 'Winner ' + win.player
            this.#showWinningLine(win.start, win.end)
            this.playing = false
        }
    }

    #reset(): void {
        NAF.utils.takeOwnership(this.syncNetworkedEl)

        this.turn = 0
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]
        this.message = ''
        NAF.utils.takeOwnership(this.lineNetworkedEl)
        this.#hideWinningLine()
        this.playing = true
    }

    #determineWinner(board: string[][], size: number): WinInfo | null {
        for (let i = 0; i < size; i++) {
            if (board[i][0] && board[i].every((val) => val === board[i][0])) {
                return { player: board[i][0], start: { x: i, y: 0 }, end: { x: i, y: size - 1 } }
            }
            if (board[0][i] && board.every((row) => row[i] === board[0][i])) {
                return { player: board[0][i], start: { x: 0, y: i }, end: { x: size - 1, y: i } }
            }
        }

        if (board[0][0] && board.every((row, i) => row[i] === board[0][0])) {
            return { player: board[0][0], start: { x: 0, y: 0 }, end: { x: size - 1, y: size - 1 } }
        }
        if (
            board[0][size - 1] &&
            board.every((row, i) => row[size - 1 - i] === board[0][size - 1])
        ) {
            return {
                player: board[0][size - 1],
                start: { x: 0, y: size - 1 },
                end: { x: size - 1, y: 0 },
            }
        }

        return null
    }

    #showWinningLine(start: BoardPosition, end: BoardPosition): void {
        const startPosition = `${-0.25 + 0.25 * start.y} ${2.2 - start.x * 0.25} 0`
        const endPosition = `${-0.25 + 0.25 * end.y} ${2.2 - end.x * 0.25} 0`
        NAF.utils.takeOwnership(this.lineNetworkedEl)
        this.lineNetworkedEl.setAttribute('start', startPosition)
        this.lineNetworkedEl.setAttribute('end', endPosition)
        this.lineNetworkedEl.setAttribute('color', 'red')
        this.lineNetworkedEl.setAttribute('visible', 'true')
    }

    #hideWinningLine(): void {
        this.lineNetworkedEl.setAttribute('visible', 'false')
    }

    // Optional Render TemplateResult
    render() {
        return html`
            ${this.board.map(
                (row, rowIndex) => html`
                    ${row.map(
                        (player, colIndex) => html`
                            <cap-box-rounded
                                class="ui"
                                width="0.2"
                                height="0.2"
                                depth="0.1"
                                radius="0.02"
                                position="${-0.25 + 0.25 * colIndex} ${2.2 - rowIndex * 0.25} 0"
                                color="lightgray"
                                transparent="true"
                                @mouseover=${(ev: Event) => {
                                    ev.target.setAttribute('color', '#AAAAAA')
                                }}
                                @mouseout=${(ev: Event) => {
                                    ;(ev.target as HTMLElement).setAttribute('color', 'lightgray')
                                }}
                                @click=${() => this.#placeMark(rowIndex, colIndex)}
                            >
                                <cap-uix-text
                                    value="${player}"
                                    anchor="center"
                                    font-size="0.1"
                                    position="0 0 0.05"
                                ></cap-uix-text>
                            </cap-box-rounded>
                        `,
                    )}
                `,
            )}
            <cap-uix-text
                id="winner"
                color="black"
                font-size="0.07"
                position="0.1 2.4 0"
                value="${this.message}"
                cap-networked-element="networkedElements:networked-state,value"
                networked-state="elements:${this.board};count:${this.turn};state:${this.playing}"
                @statechange=${(ev: CustomEvent) => {
                    const pins: string[][] = []
                    for (let i = 0; i < 3; i++) {
                        pins.push(ev.detail.elements.slice(i * 3, i * 3 + 3))
                    }

                    const count = ev.detail.count
                    const state = ev.detail.state
                    this.board = pins
                    this.turn = count
                    this.playing = state
                }}
            >
            </cap-uix-text>
            <cap-uix-text
                value="Turn:${this.turn}"
                font-size="0.05"
                position="-0.2 2.4 0"
                color="black"
            ></cap-uix-text>

            <cap-uix-button
                id="button1"
                disabled="false"
                color="#c33664"
                @click=${() => this.#reset()}
                position="-0.5 2.4 0"
            >
                <cap-uix-text
                    position="0 0 0"
                    font-size="0.04"
                    value="Restart"
                    color="white"
                ></cap-uix-text>
                <cap-uix-icon
                    icon="restart_alt"
                    size="0.07"
                    color="white"
                    position="-0.12 0 0.01"
                ></cap-uix-icon>
            </cap-uix-button>
            <cap-line
                position="0 0 0.01"
                start="0 0 0"
                end="0 0 0"
                id="winning-line"
                visible="false"
                width="0.004"
                cap-networked-element=""
            ></cap-line>
            <cap-uix-card-box
                rotation="0 90 0"
                width="5"
                height="3"
                depth="0.5"
                position="-7.8 2 0"
            >
            </cap-uix-card-box>
        `
    }
}

export default TicTacToeElement
