module.exports = function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      FunctionDeclaration(path) {
        // 获取函数体
        const body = path.get("body");
        // 检查函数体是否包含'this'关键字
        if (checkForThis(body.node.body)) {
          return;
        }
        // 转换为箭头函数
        path.node.type = "VariableDeclaration";
        path.node.kind = "const";
        path.node.declarations = [t.variableDeclarator(path.node.id, t.arrowFunctionExpression(path.node.params, body.node))];
      },
      FunctionExpression(path) { 
        // 获取函数体
        const body = path.get("body");
        // 检查函数体是否包含'this'关键字
        if (checkForThis(body.node.body)) {
          return;
        }
        // 转换为箭头函数
        path.replaceWith(t.arrowFunctionExpression(path.node.params, body.node));
      },
    },
  };

  // 检查函数体是否包含'this'关键字
  function checkForThis(node) {
    let hasThis = false;

    function check(node) {
      if (t.isThisExpression(node)) {
        hasThis = true;
      } else {
        for (const key in node) {
          if (node.hasOwnProperty(key) && typeof node[key] === 'object' && node[key] !== null) {
            check(node[key]);
          }
        }
      }
    }

    check(node);
    return hasThis;
  }
};