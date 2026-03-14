export type Quote = {
  text: string;
  author?: string;
  source?: string;
};

export const quotes: Quote[] = [
  {
    text: "我们读书，是为了知道自己并不孤独。",
    author: "C.S. 路易斯",
  },
  {
    text: "写作是思考的唯一方式。",
    author: "保罗·格雷厄姆",
    source: "Putting Ideas into Words",
  },
  {
    text: "一个人在年轻时应当尽量扩大知识的疆域，却不必急着表态。",
  },
  {
    text: "大多数人高估了他们一年能做到的事，低估了他们十年能做到的事。",
    author: "比尔·盖茨",
  },
  {
    text: "故君子苟能无解其五藏，无擢其聪明；尸居而龙见，渊默而雷声，神动而天随，从容无为而万物炊累焉。",
    author: "庄子",
    source: "在宥",
  },
];
