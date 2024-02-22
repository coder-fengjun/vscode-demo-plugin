const vscode = require('vscode');  // 导入 VSCode 模块
const fs = require('fs');  // 导入文件系统模块
const babel = require('@babel/core');  // 导入 Babel 核心模块
const convertFunctionsToArrowPlugin = require('./convert-function-to-arrow');  // 导入自定义的 Babel 插件

function activate(context) {
  const disposable = vscode.commands.registerCommand('extension.convertToArrowFunctions', () => {
    const editor = vscode.window.activeTextEditor;  // 获取当前活动的文本编辑器
    if (!editor) {
      vscode.window.showInformationMessage('未找到活动文本编辑器。');  // 显示信息消息
      return;
    }

    const doc = editor.document;  // 获取当前编辑器的文档
    const text = doc.getText();  // 获取文档的文本内容
    const updatedText = convertToArrowFunctions(text);  // 调用转换函数处理文本

    if (updatedText !== text) {  // 如果文本有变化
      fs.writeFileSync(doc.uri.fsPath, updatedText);  // 将更新后的文本写回文件
      vscode.window.showInformationMessage('函数已转换为箭头函数。');  // 显示成功消息
    } else {
      vscode.window.showInformationMessage('无需转换的函数。');  // 显示无需转换的消息
    }
  });

  context.subscriptions.push(disposable);  // 将命令订阅添加到上下文
}

function convertToArrowFunctions(text) {
  const babelResult = babel.transformSync(text, {
    plugins: [convertFunctionsToArrowPlugin],  // 使用自定义 Babel 插件进行转换
  });

  return babelResult.code || text;  // 返回转换后的代码，或原始代码
}

module.exports = {
  activate,
};