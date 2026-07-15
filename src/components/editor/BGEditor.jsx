import JoditEditor from 'jodit-react';
import { useMemo } from 'react';

export function BGEditor({ editorRef, value, onChange }) {
  const config = useMemo(() => ({
    readonly: false,
    height: 'calc(100vh - 196px)',
    minHeight: 520,
    toolbarAdaptive: true,
    toolbarSticky: true,
    statusbar: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    buttons: 'undo,redo,|,bold,italic,underline,strikethrough,|,ul,ol,|,font,fontsize,brush,paragraph,|,align,|,link,image,table,|,hr,source,fullsize,preview,print',
    placeholder: 'Start editing the bank guarantee...',
    style: { fontFamily: 'Inter, ui-sans-serif, system-ui', fontSize: '14px', lineHeight: '1.75', color: '#27364b', padding: '30px 42px' }
  }), []);
  return <JoditEditor ref={editorRef} value={value} config={config} onBlur={onChange} onChange={onChange} />;
}
