
const TurboType = {
  SEQUENCE_FLOW: 1,
  START_EVENT : 2,
  END_EVENT : 3,
  USER_TASK: 4,
  SERVICE_TASK : 5,
  EXCLUSIVE_GATEWAY : 6,
}

function getTurboType (type) {
  switch (type) {
    case "start": // 服务
      return TurboType.START_EVENT;
    case "end": // 服务
      return TurboType.START_EVENT;
    case "device": // 设备
      return TurboType.USER_TASK;
    case "rect": // 场景
      return TurboType.SEQUENCE_FLOW;
    case "algorithm":
      return TurboType.END_EVENT;
    case "polyline":
      return TurboType.SERVICE_TASK;
    default:
      return type;
  }
}

function convertNodeToTurboElement(node) {
  const { id, type, x, y, properties  } = node;
  const { flowProperties,...params } = properties;
  return {
    prev: [],
    next: [],
    procType: getTurboType(node.type),
    ...params,
    properties: {
      ...flowProperties,
      x: x,
      y: y,
      logicFlowType: type,
    },
    current: id,
  };
}

function convertEdgeToTurboElement (edge) {
  const {
    id,
    type,
    sourceNodeId,
    targetNodeId,
    startPoint,
    endPoint,
    pointsList,
    text = '',
    properties } = edge;
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
      logicFlowType: type,
    },
    current: id,
  };
}

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
    sourceElement.next.push(flowElement.current);
    const targetElement = nodeMap.get(edge.targetNodeId);
    targetElement.prev.push(flowElement.current);
    turboData.proc.push(flowElement);
  });

  return turboData;
}


function convertFlowElementToEdge(element) {
  const { incoming, outgoing, properties, key } = element;
  const {
    text,
    startPoint,
    endPoint,
    pointsList,
    logicFlowType
  } = properties;
  const edge = {
    id: key,
    type: logicFlowType,
    sourceNodeId: incoming[0],
    targetNodeId: outgoing[0],
    text,
    startPoint,
    endPoint,
    pointsList,
    properties: {}
  };
  const excludeProperties = ['startPoint', 'endPoint', 'pointsList', 'text', 'logicFlowType'];
  Object.keys(element.properties).forEach(property => {
    if (excludeProperties.indexOf(property) === -1) {
      edge.properties[property] = element.properties[property];
    }
  });
  return edge;
}

function convertFlowElementToNode(element) {
  const { properties, key } = element;
  const { x, y, text, logicFlowType } = properties;
  const node = {
    id: key,
    type: logicFlowType,
    x,
    y,
    text,
    properties: {}
  };
  const excludeProperties = ['x', 'y', 'text', 'logicFlowType'];
  Object.keys(element.properties).forEach(property => {
    if (excludeProperties.indexOf(property) === -1) {
      node.properties[property] = element.properties[property];
    }
  });
  return node;

}

// 后台数据转logicFlow
export function toLogicflowData(data) {
  const lfData = {
    nodes: [],
    edges: [],
  };
  const list = data.flowElementList;
  list && list.length > 0 && list.forEach(element => {
    if (element.type === TurboType.SEQUENCE_FLOW) {
      const edge = convertFlowElementToEdge(element);
      lfData.edges.push(edge);
    } else {
      const node = convertFlowElementToNode(element);
      lfData.nodes.push(node);
    }
  })
  return lfData;
}