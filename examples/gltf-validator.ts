class GltfValidator extends CapElement {
    @property()
    dataJson: Array = []

    @query('#player-rig')
    playerRig

    @query('#info')
    info

    @query('#modelInfo')
    modelInfo

    @query('#ground')
    ground
    // Do something when component first attached.
    async init() {
        this.intensity = 1.0
        const { validateBytes } = await import(
            'https://cdn.jsdelivr.net/npm/gltf-validator@2.0.0-dev.3.9/+esm'
        )
        this.validateBytes = validateBytes

        const jsonUrl =
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/model-index.json'
        this.fetchJson(jsonUrl)
    }
    tick(t, dt) {}
    fetchJson = async (url) => {
        try {
            console.error(url)
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            this.dataJson = await response.json()
        } catch (error) {
            console.error('Error fetching JSON:', error)
        }
    }
    handleChange = (event) => {
        this.selectedValue = event.target.value
        console.log('Selected value:', this.selectedValue)
        this.el.sceneEl.setAttribute('environment-map', {
            textureSrc: event.target.value,
            environmentSky: true,
        })
    }

    handleFileChange = (event) => {
        const file = event.target.files[0]
        const old = document.querySelector('#model')
        if (old) {
            old.removeAttribute('gltf-model-plus')
            this.el.sceneEl.removeChild(old)
        }
        if (file) {
            const el = document.createElement('a-entity')
            el.setAttribute('position', { x: 0, y: 0, z: -5 })
            const fileURL = URL.createObjectURL(file)
            el.setAttribute('gltf-model-plus', { src: fileURL })
            el.id = 'model'
            this.el.sceneEl.appendChild(el)
            const reader = new FileReader()
            reader.onload = (e) => {
                const arrayBuffer = e.target.result
                const uint8Array = new Uint8Array(arrayBuffer)

                this.validateBytes(uint8Array).then((report) => {
                    const info = report.info
                    delete info.resources
                    console.log(JSON.stringify(info, null, '  '))
                    this.modelInfo.innerHTML = JSON.stringify(info, null, '  ')
                })
            }
            reader.readAsArrayBuffer(file)

            console.log('Selected file:', file.name)
        }
    }
    handleSliderChange = (event) => {
        this.intensity = parseFloat(event.target.value)
        this.requestUpdate()
        console.log('Intensity:', this.intensity)
    }

    toggleGround = (event) => {
        ground.setAttribute('visible', event.target.checked)
    }
    selectFile = async () => {
        const old = document.querySelector('#model')
        if (old) {
            old.removeAttribute('gltf-model-plus')
            this.el.sceneEl.removeChild(old)
        }
        const [fileHandle] = await window.showOpenFilePicker()
        const file = await fileHandle.getFile()

        const watcher = new FileReader()
        watcher.readAsArrayBuffer(file)
        let lastModificationTime = file.lastModified

        async function compare() {
            const file = await fileHandle.getFile()
            if (file.lastModified > lastModificationTime) {
                lastModificationTime = +file.lastModified
                watcher.readAsArrayBuffer(file)
            }
        }

        //TODO use https://chromestatus.com/feature/4622243656630272?context=myfeatures
        watcher.onload = () => {
            const currentData = new Uint8Array(watcher.result)
            const blob = new Blob([currentData], { type: 'application/octet-stream' })
            const old = document.querySelector('#model')
            if (old) {
                old.removeAttribute('gltf-model-plus')
                this.el.sceneEl.removeChild(old)
            }
            // Create a URL for the Blob
            const objectUrl = URL.createObjectURL(blob)
            const el = document.createElement('a-entity')
            el.setAttribute('position', { x: 0, y: 0, z: -5 })
            el.setAttribute('gltf-model-plus', { src: objectUrl })
            el.id = 'model'
            this.el.sceneEl.appendChild(el)

            setInterval(compare, 5000)
            this.validateBytes(currentData).then((report) => {
                const info = report.info
                delete info.resources
                console.log(JSON.stringify(info, null, '  '))
                this.modelInfo.innerHTML = JSON.stringify(info, null, '  ')
            })
        }
    }

    render() {
        return html`
            <style>
                pre {
                    min-height: 100px;
                    font-size: 10px; /* Adjust the font size as needed */
                    font-family: monospace;
                    line-height: 1; /* Optional: Adjust line height for readability */
                    padding: 10px; /* Optional: Add padding for better appearance */
                    background-color: #f5f5f5; /* Optional: Add background color for contrast */
                    border: 1px solid #ccc; /* Optional: Add border for better visibility */
                    border-radius: 5px; /* Optional: Round the corners of the box */
                    overflow-x: auto; /* Optional: Allow horizontal scrolling if needed */
                }
                .row {
                    display: flex;
                    align-items: left;
                    margin: 10px 0;
                    flex-direction: column;
                }

                #info {
                    width: min-content;
                    font-family: 'Figtree';
                    pointer-events: auto;
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    background-color: #ffffffa8;
                    padding: 10px;
                    position: absolute;
                    right: 0px;
                    border-radius: 20px;
                    opacity: 1;
                    transition: opacity 0.1s linear 0.2s;
                    bottom: 100px;
                    top: 200px;
                    z-index: 100;
                }
                .button {
                    background-color: #c33664;
                    border: none;
                    color: white;
                    padding: 1px 3px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    border-radius: 8px;
                }
            </style>
            <div id="info">
                <label class="row"><span>envMap</span></label>
                <select id="sc-envMap" @change="${this.handleChange}">
                    <option value="courtyard_1k.jpg">Courtyard</option>
                    <option value="hotel_room_1k.jpg">Hotel Room</option>
                    <option value="moonless_golf_1k.jpg">Moonless Golf</option>
                    <option value="ninomaru_teien_1k.jpg">Ninomaru Teien</option>
                    <option value="spruit_sunrise_1k.jpg">Spruit Sunrise</option>
                    <option value="venice_sunset_1k.jpg">Venice Sunset</option>
                    <option value="portland_landing_pad_1k.jpg">Portland Landing Pad</option>
                    <option value="dam_wall_1k.jpg">Dam Wall</option>

                    <option value="courtyard_1k.jpg">Industrial Sunset PureSky</option>
                    <option value="kloofendal_43d_clear_puresky_1k.jpg">
                        Kloofendal Clear PureSky
                    </option>
                    <option value="pizzo_pernice_1k.jpg">Pizzo Pernice</option>
                    <option value="small_empty_room_4_1k.jpg">Small Empty Room</option>
                    <option value="sunflowers_puresky_1k.jpg">Sunflowers PureSky</option>
                </select>
                <input
                    type="checkbox"
                    class="toggle-checkbox"
                    id="toggleGround"
                    checked
                    @change=${this.toggleGround}
                />
                <label for="toggleTabs">Show Ground</label>

                ${'showOpenFilePicker' in window
                    ? html` <label class="row">
                          <button class="button" @click="${this.selectFile}">Select File</button>
                      </label>`
                    : html` <label class="row">
                          Select File:
                          <input
                              type="file"
                              accept=".glb"
                              id="fileInput"
                              @change="${this.handleFileChange}"
                          />
                      </label>`}

                <pre class="row" id="modelInfo"></pre>
            </div>
        `
    }
}
export default GltfValidator
