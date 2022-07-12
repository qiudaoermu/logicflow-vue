export const nodeList = [
         {
           type: "start",
           class: "node-start",
           text: "开始节点",
           label: "开始",
         },
         {
           text: "矩形节点",
           type: "rect",
           class: "node-rect",
           label: "矩形",
         },
         {
           text: "圆形节点",
           type: "circle",
           class: "node-circle",
           label: "圆形",
         },
         {
           type: "user",
           text: "用户节点",
           class: "node-user",
           label: "用户",
         },
         {
           type: "device",
           text: "位置节点",
           class: "node-device",
           label: "位置",
         },
         {
           type: "end",
           text: "结束节点",
           class: "node-end",
           label: "结束",
         },
       ];

export const BpmnNode = [
  {
    type: 'bpmn:startEvent',
    text: '开始',
    class: 'bpmn-start'
  },
  {
    type: 'bpmn:endEvent',
    text: '结束',
    class: 'bpmn-end'
  },
  {
    type: 'bpmn:exclusiveGateway',
    text: '网关',
    class: 'bpmn-exclusiveGateway'
  },
  {
    type: 'bpmn:userTask',
    text: '用户',
    class: 'bpmn-user'
  }
]
