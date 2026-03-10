/**
 * Markdown to HTML Converter
 * 使用成熟库 marked 实现
 *
 * 安装: npm install marked
 * 运行: node md2html-example.js
 */

import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

/**
 * Markdown 转 HTML
 */
function md2html(markdown, options = {}) {
  const defaultOptions = {
    gfm: true,        // GitHub Flavored Markdown
    breaks: true,     // 支持换行符
    headerIds: true,  // 标题添加 ID
    mangle: false,    // 不混淆邮箱地址
    ...options
  };

  return marked(markdown, defaultOptions);
}

/**
 * 读取 MD 文件并转换为 HTML
 */
function convertFile(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`文件不存在: ${inputPath}`);
  }

  const markdown = fs.readFileSync(inputPath, 'utf-8');
  const html = md2html(markdown);

  // 默认输出到源文件目录，同名 .html 文件
  if (!outputPath) {
    const inputDir = path.dirname(inputPath);
    const inputBasename = path.basename(inputPath, '.md');
    outputPath = path.join(inputDir, `${inputBasename}.html`);
  }

  const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${path.basename(inputPath, '.md')}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    h1, h2, h3 { margin-top: 1.5em; }
    code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  fs.writeFileSync(outputPath, htmlTemplate);
  console.log(`✅ 已生成: ${outputPath}`);

  return html;
}

// CLI 使用 - 只在直接运行时执行
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
使用方法:
  node md2html-example.mjs <input.md> [output.html]

示例:
  node md2html-example.mjs README.md
  node md2html-example.mjs README.md custom.html
    `);
    process.exit(0);
  }

  const [input, output] = args;

  try {
    convertFile(input, output);
  } catch (error) {
    console.error(`❌ 错误: ${error.message}`);
    process.exit(1);
  }
}

export { md2html, convertFile };
