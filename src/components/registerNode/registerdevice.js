const NODE_COLOR = "#1890ff";
export default function registerdevice(lf) {
  lf.register('device', ({ PolygonNode, PolygonNodeModel, h }) => {
    class Node extends PolygonNode {
      getIconShape () {
        return h(
          "svg",
          {
            x: 14,
            y: 13,
            width: 23,
            height: 23,
            viewBox: "0 0 1024 1024",
          },
          h("path", {
            fill: NODE_COLOR,
            d:
              "M185.6 723.2v89.6h652.8v-89.6H185.6z m-6.4-64h665.6c31.7952 0 57.6 25.8048 57.6 57.6v102.4c0 31.7952-25.8048 57.6-57.6 57.6h-665.6A57.6 57.6 0 0 1 121.6 819.2v-102.4c0-31.7952 25.8048-57.6 57.6-57.6zM185.6 211.2v294.4h448v-294.4h-448zM179.2 147.2h460.8c31.7952 0 57.6 25.8048 57.6 57.6v307.2c0 31.7952-25.8048 57.6-57.6 57.6h-460.8A57.6 57.6 0 0 1 121.6 512V204.8c0-31.7952 25.8048-57.6 57.6-57.6z",
          }),
          h("path", {
            fill: NODE_COLOR,
            d:
              "M697.6 415.4368l140.8 70.4V230.912l-140.8 70.4v114.0736z m121.4464-246.3232a57.6 57.6 0 0 1 83.3536 51.5072v275.5584a57.6 57.6 0 0 1-83.3536 51.5072l-185.4464-92.672V261.7856l185.4464-92.7232z",
          })
        );
      }
      getShape () {
        const {model} = this.props
        const {width, height, x, y, points} = model
        const {
          fill,
          fillOpacity,
          strokeWidth,
          stroke,
          strokeOpacity,
        } = model.getNodeStyle()
        const transform = `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`
        const pointsPath = points.map(point => point.join(',')).join(' ')
        return h(
          'g',
          {
            transform
          },
          [
            h(
              'polygon',
              {
                points: pointsPath,
                fill,
                stroke,
                strokeWidth,
                strokeOpacity,
                fillOpacity
              }
            ),
            this.getIconShape()
          ]
        )
      }
    }
    class Model extends PolygonNodeModel {
      constructor (data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 50
        }
        super(data, graphModel)
        const lenght = 25
        this.points = [
          [lenght, 0],
          [lenght * 2, lenght],
          [lenght, lenght * 2],
          [0, lenght]
        ]
      }
      getNodeStyle() {
        const style = super.getNodeStyle()
        style.stroke = NODE_COLOR
        return style
      }
    }
    return {
      view: Node,
      model: Model
    }
  })
}
