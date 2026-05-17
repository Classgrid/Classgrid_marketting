const fs = require('fs');

let content = fs.readFileSync('app/support/ticket/page.tsx', 'utf8');

const s1_lf = `  const [files, setFiles] = useState<File[]>([]);\n  const [dragActive, setDragActive] = useState(false);\n  const fileInputRef = useRef<HTMLInputElement>(null);`;
const s1_crlf = `  const [files, setFiles] = useState<File[]>([]);\r\n  const [dragActive, setDragActive] = useState(false);\r\n  const fileInputRef = useRef<HTMLInputElement>(null);`;

const r1 = `  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);`;

content = content.replace(s1_crlf, r1).replace(s1_lf, r1);

const s2_lf = `                  <ToolBtn\n                    icon={<ImageIcon className="w-3.5 h-3.5" />}\n                    onClick={() => {\n                      const url = prompt("Enter image URL:");\n                      if (url) document.execCommand("insertImage", false, url);\n                    }}\n                  />`;
const s2_crlf = `                  <ToolBtn\r\n                    icon={<ImageIcon className="w-3.5 h-3.5" />}\r\n                    onClick={() => {\r\n                      const url = prompt("Enter image URL:");\r\n                      if (url) document.execCommand("insertImage", false, url);\r\n                    }}\r\n                  />`;

const r2 = `                  <ToolBtn
                    icon={<ImageIcon className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingImage(true);
                          setUploadProgress(10);
                          const interval = setInterval(() => {
                            setUploadProgress((prev) => {
                              if (prev >= 90) {
                                clearInterval(interval);
                                return 90;
                              }
                              return prev + 15;
                            });
                          }, 100);

                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setTimeout(() => {
                              setUploadProgress(100);
                              setTimeout(() => {
                                setUploadingImage(false);
                                if (re.target?.result) {
                                  const editor = document.getElementById("richEditor");
                                  if (editor) editor.focus();
                                  document.execCommand("insertImage", false, re.target.result.toString());
                                  if (editor) setDescription(editor.innerHTML);
                                }
                              }, 300);
                            }, 700);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                  />`;

content = content.replace(s2_crlf, r2).replace(s2_lf, r2);

const s3_lf = `                  {/* Plain text toggle */}\n                  <div className="ml-auto">\n                    <button\n                      type="button"`;
const s3_crlf = `                  {/* Plain text toggle */}\r\n                  <div className="ml-auto">\r\n                    <button\r\n                      type="button"`;

const r3 = `                  {/* Plain text toggle */}
                  <div className="ml-auto flex items-center gap-3">
                    {uploadingImage && (
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Uploading {uploadProgress}%</div>
                        <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-200" style={{ width: \`\${uploadProgress}%\` }} />
                        </div>
                      </div>
                    )}
                    <button
                      type="button"`;

content = content.replace(s3_crlf, r3).replace(s3_lf, r3);

fs.writeFileSync('app/support/ticket/page.tsx', content);
