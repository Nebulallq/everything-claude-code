/**
 * 批量转换项目中所有 MD 文件为 HTML
 */

import { glob } from 'glob';
import { convertFile } from './md2html-example.mjs';

async function batchConvert(pattern = '**/*.md') {
  console.log('🔍 扫描 Markdown 文件...\n');

  const files = await glob(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/*.html',  // 跳过已生成的 HTML
    ],
    cwd: process.cwd()
  });

  console.log(`📁 找到 ${files.length} 个 Markdown 文件\n`);

  let success = 0;
  let failed = 0;
  const errors = [];

  for (const file of files) {
    try {
      convertFile(file, null);  // null = 自动生成到源目录
      success++;
    } catch (error) {
      failed++;
      errors.push({ file, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 转换完成:`);
  console.log(`   ✅ 成功: ${success}`);
  console.log(`   ❌ 失败: ${failed}`);

  if (errors.length > 0) {
    console.log('\n❌ 失败的文件:');
    errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
  }
}

batchConvert();
