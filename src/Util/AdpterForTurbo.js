import * as node from "../components/registerNode/index";
let register = Object.values(node).map((item) =>
  item.name.replace("register", "")
);
const TurboType = {
  SEQUENCE_FLOW: 1,
  START_EVENT: 2,
  END_EVENT: 3,
  USER_TASK: 4,
  SERVICE_TASK: 5,
  EXCLUSIVE_GATEWAY: 6,
};

function getTurboType(type) {
  switch (type) {
    case "start": // 服务
      return TurboType.START_EVENT;
    case "end": // 服务
      return TurboType.START_EVENT;
    case "device": // 设备
      return TurboType.USER_TASK;
    case "scene": // 场景
      return TurboType.SEQUENCE_FLOW;
    case "algorithm":
      return TurboType.END_EVENT;
    case "polyline":
      return TurboType.SERVICE_TASK;
    default:
      return type;
  }
}

const addPropAccordingType = (type, properties) => {
  if (getTurboType(type) === TurboType.END_EVENT) {
    return { params: properties.params };
  }
};
export function toTurboData(data) {
  const nodeMap = new Map();
  const turboData = {
    proc: [],
  };
  data.nodes.forEach((node) => {
    const flowElement = convertNodeToTurboElement(node);
    turboData.proc.push(flowElement);
    nodeMap.set(node.id, flowElement);
  });
  data.edges.forEach((edge) => {
    const flowElement = convertEdgeToTurboElement(edge);
    const sourceElement = nodeMap.get(edge.sourceNodeId);
    sourceElement.next = flowElement.current;
    const targetElement = nodeMap.get(edge.targetNodeId);
    targetElement.prev = flowElement.current;
    turboData.proc.push(flowElement);
  });

  return turboData;
}

function convertNodeToTurboElement(node) {
  const { x, y, properties } = node;
  const {  flowProperties, ...param } = properties;
  const { text, label, type, ...lefts } = param;
  let props = addPropAccordingType(node.type, properties)
  return {
    prev: [],
    next: [],
    procType: getTurboType(node.type),
    ...lefts,
    properties: {
      ...flowProperties,
      text: flowProperties.text,
      x: x,
      y: y,
    },
    current: node.id,
  };
}

function convertEdgeToTurboElement(edge) {
  const {
    id,
    type,
    sourceNodeId,
    targetNodeId,
    startPoint,
    endPoint,
    pointsList,
    text = "",
    properties,
  } = edge;
  return {
    prev: [sourceNodeId],
    next: [targetNodeId],
    procType: getTurboType(type),
    properties: {
      ...properties,
      name: (text && text.value) || "",
      text,
      startPoint,
      endPoint,
      pointsList,
       type,
    },
    current: id,
  };
}





// 后台数据转logicFlow
export function toLogicflowData(data) {
  const lfData = {
    nodes: [],
    edges: [],
  };

  if (!data.procDetailList) return {};
  const list = data.procDetailList;
  list &&
    list.length > 0 &&
    list.forEach((element) => {
      if (element.procType === TurboType.SERVICE_TASK) {
        const edge = convertFlowElementToEdge(element);
        lfData.edges.push(edge);
      } else {
        const node = convertFlowElementToNode(element);
        lfData.nodes.push(node);
      }
    });
  return lfData;
}

function convertFlowElementToEdge(element) {
  element.properties = JSON.parse(element.properties);
  const { prev, next, properties, current } = element;

  const { text, startPoint, endPoint, pointsList, type } = properties;
  const edge = {
    id: current,
    type,
    sourceNodeId: prev,
    targetNodeId: next,
    text,
    startPoint,
    endPoint,
    pointsList,
    properties: {},
  };
  const excludeProperties = [
    "startPoint",
    "endPoint",
    "pointsList",
    "text",
    "type",
  ];
  Object.keys(element.properties).forEach((property) => {
    if (excludeProperties.indexOf(property) === -1) {
      edge.properties[property] = element.properties[property];
    }
  });
  return edge;
}

function convertFlowElementToNode(element) {
  element.properties = JSON.parse(element.properties);
  const { properties, current, ...lefts } = element;
  const { text, type, x, y } = properties;
  let props = addPropAccordingType(type, properties);
  const node = {
    id: current,
    type,
    text: register.includes(type)
      ? {
          value: text,
        }
      : text,
    x,
    y,
    properties: {
      ...properties,
      ...lefts,
      ...props,
      flowProperties: {
        x,
        y,
        type,
        text,
      },
    },
  };

  return node;
}