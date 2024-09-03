class SampleElement extends CapElement {
    @query('dialog')
    dialogElement

    #showInfo = () => {
        this.dialogElement.showModal()
    }

    #closeDialog = () => {
        this.dialogElement.close()
    }

    render() {
        return html`
            <style>
                #info {
                    width: 100px;
                    height: 50px;
                    border-radius: 20px;
                    cursor: pointer;
                    background-color: rgb(230, 0, 0);
                    color: white;
                    margin-top: 10px;
                    font-size: xx-large;
                    border-width: 0.1px;
                }

                dialog {
                    z-index: 10;
                    margin-top: 100px;
                    background-color: hsl(0deg 0% 100% / 75%);
                    border: none;
                    border-radius: 0.5rem;
                    backdrop-filter: blur(15px);
                    width: 400px;
                    height: 50vh;
                }

                dialog::backdrop {
                    /* Customize backdrop appearance */
                }
            </style>

            <dialog
                @click="${(e) => {
                    const dialogDimensions = this.dialogElement.getBoundingClientRect()
                    if (
                        e.clientX < dialogDimensions.left ||
                        e.clientX > dialogDimensions.right ||
                        e.clientY < dialogDimensions.top ||
                        e.clientY > dialogDimensions.bottom
                    ) {
                        this.#closeDialog()
                    }
                }}"
            >
                <div>
                    <img
                        style="display:flex;height:300px;"
                        src="https://aomediacodec.github.io/av1-avif/testFiles/Link-U/kimono.avif"
                        sizes="(max-width: 800px) 100px, 200px"
                    />
                    <h1
                        style="margin: 0px; color: rgb(156, 187, 54); --fontSize: 42; line-height: 1.4;"
                        data-fontsize="42"
                        data-lineheight="58.8px"
                    >
                        <span style="color: #301d1d;"
                            >Authors: Momiji Jinzamomi(@momiji-san) and Kaede
                            Fujisaki(@ledyba)</span
                        >
                    </h1>
                    <iframe src="https://vrland.io/lobby" width="100%" height="200px"> </iframe>
                    <button @click="${this.#closeDialog}">Close</button>
                </div>
            </dialog>

            <a-entity
                class="interactable"
                position="3 1.5 -2"
                geometry="primitive:box;width:3;height:3;"
                material="src:https://aomediacodec.github.io/av1-avif/testFiles/Link-U/kimono.avif;side:double;"
                @click="${this.#showInfo}"
            >
            </a-entity>
        `
    }
}

export default SampleElement
