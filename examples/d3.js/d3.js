const { Color, Vector3 } = THREE

// Sample using https://d3js.org/getting-started

class D3Element extends CapElement {
    schema = {}

    GridGeometry(width = 1, height = 1, wSeg = 1, hSeg = 1, lExt = [0, 0], rot = ['x', 0]) {
        let seg = new THREE.Vector2(width / wSeg, height / hSeg)
        let hlfSeg = seg.clone().multiplyScalar(0.5)

        let axis = rot[0] == 'x' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
        let rotAngle = rot[1]

        let pts = [],
            count = 0

        for (let y = 0; y <= hSeg; y++) {
            pts.push(
                new THREE.Vector3(0, y * seg.y, 0).applyAxisAngle(axis, rotAngle),
                new THREE.Vector3(width + hlfSeg.x * lExt[0], y * seg.y, 0).applyAxisAngle(
                    axis,
                    rotAngle,
                ),
            )
        }

        for (let x = 0; x <= wSeg; x++) {
            pts.push(
                new THREE.Vector3(x * seg.x, 0, 0).applyAxisAngle(axis, rotAngle),
                new THREE.Vector3(x * seg.x, height + hlfSeg.y * lExt[1], 0).applyAxisAngle(
                    axis,
                    rotAngle,
                ),
            )
        }

        return new THREE.BufferGeometry().setFromPoints(pts)
    }

    async init() {
        const {
            extent,
            csv,
            json,
            timeYear,
            timeParse,
            timeFormat,
            scaleTime,
            scaleLinear,
            scaleBand,
            scaleSequential,
            interpolateBlues,
            interpolatePuBuGn,
            mean,
            flatRollup,
        } = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')

        const years = ['1 Yr', '2 Yr', '3 Yr', '5 Yr', '7 Yr', '10 Yr']
        const colors = ['blue', 'green', 'black', 'red', 'pink', 'orange']

        const parseTime = timeParse('%m/%d/%Y')
        const dateFormat = timeFormat('%y')

        const data = await csv(
            'https://raw.githubusercontent.com/jpmorganchase/anu/main/anu-examples/data/yield-curve.csv',
        )

        const cars = await json(
            'https://raw.githubusercontent.com/jpmorganchase/anu/main/anu-examples/data/cars.json',
        )

        const iris = await json(
            'https://raw.githubusercontent.com/jpmorganchase/anu/main/anu-examples/data/iris.json',
        )

        const dates = data.map((d) => parseTime(d.Date))

        const scaleX = scaleTime().domain(extent(dates)).range([-2, 2])
        const scaleY = scaleLinear().domain([0, 9]).range([-1, 1]).nice()
        const scaleC = scaleSequential(interpolateBlues).domain([1, -1])

        let myPaths = years.map((r) => {
            return data.map((c) => {
                return new Vector3(scaleX(parseTime(c.Date)), scaleY(c[r]))
            })
        })
        const entity = document.createElement('a-entity')
        entity.setAttribute('position', { x: 0, y: 2, z: -4 })

        for (const [i, path] of myPaths.entries()) {
            const material = new THREE.LineBasicMaterial({
                color: new THREE.Color(colors[i]),
            })

            const geometry = new THREE.BufferGeometry().setFromPoints(path)
            const line = new THREE.Line(geometry, material)
            entity.object3D.add(line)
        }
        this.el.appendChild(entity)
        const entityBox = document.createElement('a-entity')
        entityBox.setAttribute('box-rounded', { width: 2.5, height: 1.2, borderRadius: 0.02 })
        entityBox.setAttribute('position', { z: -0.01 })
        entity.appendChild(entityBox)

        let g1 = this.GridGeometry(4, 2, 16, 9)
        let m1 = new THREE.LineBasicMaterial({ color: 'maroon' })
        let grid1 = new THREE.LineSegments(g1, m1)
        grid1.position.x = -2
        grid1.position.y = -1
        grid1.position.z = -0.01
        entity.object3D.add(grid1)

        const labelX = document.createElement('a-entity')

        labelX.setAttribute('position', { y: -1.1, z: 0 })
        entity.appendChild(labelX)
        const labelXValues = []
        for (const [i, x] of scaleX.ticks(timeYear.every(2)).entries()) {
            const date = new Date(Date.parse(x))
            labelXValues.push(date.getFullYear())
        }
        labelX.setAttribute('troika-text', {
            value: labelXValues.toString().replaceAll(',', '             '),
            color: 'black',
            fontSize: 0.05,
        })

        const labelYValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

        for (const [i, x] of labelYValues.entries()) {
            const labelY = document.createElement('a-entity')

            labelY.setAttribute('position', { x: -2.2, y: i / 4.5 - 1, z: 0 })
            labelY.setAttribute('troika-text', {
                value: i + '%',
                color: 'black',
                fontSize: 0.05,
                toneMapped: false,
            })
            entity.appendChild(labelY)
        }

        this.entity = entity

        // 2D Bar Char
        const origin = [...new Set(cars.map((item) => item.Origin))]
        const cylinders = [...new Set(cars.map((item) => item.Cylinders))].sort()
        let carsRollup = flatRollup(
            cars,
            (v) => {
                return {
                    Horsepower: mean(v, (d) => d.Horsepower),
                    Miles_per_Gallon: mean(v, (d) => d.Miles_per_Gallon),
                }
            },
            (d) => d.Cylinders,
        )

        carsRollup = carsRollup.map(([Cylinders, Data]) => ({ Cylinders, ...Data }))

        //Get Min/Max values for our linear scales
        const horsepowerMinMax = extent([...new Set(carsRollup.map((item) => item.Horsepower))])
        const MPGMinMax = extent([...new Set(carsRollup.map((item) => item.Miles_per_Gallon))])

        //Create our scales for positioning and coloring meshes
        let scaleCarX = scaleBand()
            .domain(cylinders)
            .range([-1, 1])
            .paddingInner(1)
            .paddingOuter(0.5)
        let scaleCarY = scaleLinear().domain(horsepowerMinMax).range([0, 2]).nice()

        let scaleCarC = scaleSequential(interpolatePuBuGn).domain(MPGMinMax)
        console.error(carsRollup)

        const entityBoxBar = document.createElement('a-entity')
        entityBoxBar.setAttribute('box-rounded', { width: 2.5, height: 1.2, borderRadius: 0.02 })
        entityBoxBar.setAttribute('position', { x: 8, z: -0.01 })
        entity.appendChild(entityBoxBar)

        let g2 = this.GridGeometry(1.7, 2, 6, 9)
        let m2 = new THREE.LineBasicMaterial({ color: 'maroon' })
        let grid2 = new THREE.LineSegments(g2, m2)
        grid2.position.x = -2.1
        grid2.position.y = -1
        grid2.position.z = -0.01
        entityBoxBar.object3D.add(grid2)

        for (const [i, x] of carsRollup.entries()) {
            const bar = document.createElement('a-entity')

            bar.setAttribute('position', {
                x: i / 2.7 - 2,
                y: (x['Horsepower'] / 2) * 0.01 - 1,
                z: 0.01,
            })
            bar.setAttribute('geometry', {
                primitive: 'plane',
                width: 0.2,
                height: x['Horsepower'] * 0.01,
            })
            bar.setAttribute('material', {
                color: colors[i],
            })
            entityBoxBar.appendChild(bar)
        }
        const entity3DBar = document.createElement('a-entity')

        entity3DBar.setAttribute('position', { x: -8, y: -1, z: -0.01 })
        entity.appendChild(entity3DBar)

        let g1Bar = this.GridGeometry(4, 2, 16, 10, [0, 0])
        let m1Bar = new THREE.LineBasicMaterial({ color: 'gray' })
        let grid1Bar = new THREE.LineSegments(g1Bar, m1Bar)
        entity3DBar.object3D.add(grid1Bar)

        let g2Bar = this.GridGeometry(4, 2, 16, 10, [1, 1], ['x', Math.PI * 0.5])
        let m2Bar = new THREE.LineBasicMaterial({ color: 'gray' })
        let grid2Bar = new THREE.LineSegments(g2Bar, m2Bar)
        entity3DBar.object3D.add(grid2Bar)

        let g3Bar = this.GridGeometry(2, 2, 16, 10, [1, 0], ['y', Math.PI * -0.5])
        let m3Bar = new THREE.LineBasicMaterial({ color: 'gray' })
        let grid3Bar = new THREE.LineSegments(g3Bar, m3Bar)
        entity3DBar.object3D.add(grid3Bar)
        console.error(iris)

        for (const [i, x] of iris.entries()) {
            console.error(x)
            const sphere = document.createElement('a-entity')
            sphere.setAttribute('position', {
                x: x['sepalLength'] - 4,
                y: x['petalLength'] / 3,
                z: x['sepalWidth'] - 2,
            })
            sphere.setAttribute('geometry', {
                primitive: 'sphere',
                radius: 0.025,
            })
            sphere.setAttribute('material', {
                color: 'red',
            })
            entity3DBar.appendChild(sphere)
        }
    }

    remove() {
        this.el.removeChild(this.entity)
    }
}
export default D3Element
