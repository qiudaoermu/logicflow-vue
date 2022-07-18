const NODE_COLOR = "#ffcf0a";
export default function registerscene(lf) {
  lf.register("scene", ({ PolygonNode, PolygonNodeModel, h }) => {
    class Node extends PolygonNode {
      getIconShape() {
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
              "M704 640c-6.4 0-12.8 0-19.2 0l-96 166.4c12.8 19.2 19.2 38.4 19.2 57.6C608 915.2 563.2 960 512 960s-96-44.8-96-96S460.8 768 512 768c6.4 0 12.8 0 19.2 0l96-166.4C620.8 595.2 614.4 582.4 614.4 569.6L409.6 518.4C396.8 550.4 358.4 576 320 576 268.8 576 224 531.2 224 480S268.8 384 320 384c6.4 0 12.8 0 19.2 0l96-166.4C422.4 204.8 416 179.2 416 160 416 108.8 460.8 64 512 64s96 44.8 96 96S563.2 256 512 256C505.6 256 499.2 256 492.8 256L396.8 422.4C403.2 428.8 409.6 441.6 409.6 448l204.8 57.6C633.6 473.6 665.6 448 704 448c51.2 0 96 44.8 96 96S755.2 640 704 640zM512 832c-19.2 0-32 12.8-32 32S492.8 896 512 896c19.2 0 32-12.8 32-32S531.2 832 512 832zM512 192c19.2 0 32-12.8 32-32S531.2 128 512 128C492.8 128 480 140.8 480 160S492.8 192 512 192zM320 448C300.8 448 288 460.8 288 480S300.8 512 320 512s32-12.8 32-32S339.2 448 320 448zM704 512c-12.8 0-25.6 12.8-32 25.6 0 0 0 0 0 0l0 6.4c0 0 0 0 0 0C672 563.2 684.8 576 704 576s32-12.8 32-32S723.2 512 704 512z",
          }),
        
        );
      }
      getShape() {
        const { model } = this.props;
        const { width, height, x, y, points } = model;
        const {
          fill,
          fillOpacity,
          strokeWidth,
          stroke,
          strokeOpacity,
        } = model.getNodeStyle();
        const transform = `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`;
        const pointsPath = points.map((point) => point.join(",")).join(" ");
        return h(
          "g",
          {
            transform,
          },
          [
            h("polygon", {
              points: pointsPath,
              fill,
              stroke,
              strokeWidth,
              strokeOpacity,
              fillOpacity,
            }),
            this.getIconShape(),
          ]
        );
      }
    }
    class Model extends PolygonNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || "",
          x: data.x,
          y: data.y + 50,
        };
        super(data, graphModel);
        const lenght = 25;
        this.points = [
          [lenght, 0],
          [lenght * 2, lenght],
          [lenght, lenght * 2],
          [0, lenght],
        ];
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = NODE_COLOR;
        return style;
      }
    }
    return {
      view: Node,
      model: Model,
    };
  });
}
