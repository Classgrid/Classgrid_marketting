import { codeToHtml } from 'shiki';
import { CodeBlockClient } from './code-block-client';

export async function CodeBlock({ children }: any) {
  // When intercepting <pre>, the children is typically the <code> React element
  const codeNode = Array.isArray(children) ? children[0] : children;
  const rawCode = String(codeNode?.props?.children || children || '').replace(/\n$/, '');
  const className = codeNode?.props?.className || '';
  
  const match = /language-(\w+)/.exec(className);
  // Default to javascript if no language is specified in the markdown block
  const language = match ? match[1] : 'javascript';

  // Generate beautiful syntax highlighting and line numbers on the server
  let html = '';
  try {
    html = await codeToHtml(rawCode, {
      lang: language,
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        {
          line(node, line) {
            // Adds a data-line attribute to each line so we can apply CSS counter logic for line numbers
            node.properties['data-line'] = line;
          }
        }
      ]
    });
  } catch (e) {
    // Fallback if shiki fails to load the language
    html = `<pre><code>${rawCode}</code></pre>`;
  }

  return <CodeBlockClient rawCode={rawCode} html={html} language={language} />;
}
